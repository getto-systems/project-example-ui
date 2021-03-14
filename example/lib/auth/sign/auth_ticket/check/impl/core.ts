import { delayedChecker } from "../../../../../z_vendor/getto-application/infra/timer/helper"

import { StoreRepositoryResult } from "../../../../../z_vendor/getto-application/infra/repository/infra"
import { CheckAuthTicketInfra } from "../infra"

import { RenewAuthTicketMethod, CheckAuthTicketMethod } from "../method"

import { CheckAuthTicketEvent, RenewAuthTicketEvent } from "../event"

import { Authn, hasExpired } from "../../kernel/data"
import { authnRepositoryConverter, authRemoteConverter } from "../../kernel/converter"
import { authzRepositoryConverter } from "../../kernel/converter"

interface Check {
    (infra: CheckAuthTicketInfra): CheckAuthTicketMethod
}
export const checkAuthTicket: Check = (infra) => async (post) => {
    const { clock, config } = infra

    loadAuthn(infra, post, (authn) => {
        const time = {
            now: clock.now(),
            expire_millisecond: config.instantLoadExpire.expire_millisecond,
        }
        if (hasExpired(authn.authAt, time)) {
            renew(infra, authn, post)
            return
        }

        post({ type: "try-to-instant-load" })
    })
}

export function checkAuthTicketEventHasDone(event: CheckAuthTicketEvent): boolean {
    switch (event.type) {
        case "try-to-instant-load":
            return true

        default:
            return renewAuthTicketEventHasDone(event)
    }
}

interface RenewAuthTicket {
    (infra: CheckAuthTicketInfra): RenewAuthTicketMethod
}
export const renewAuthTicket: RenewAuthTicket = (infra) => async (post) => {
    loadAuthn(infra, post, (authn) => {
        renew(infra, authn, post)
    })
}

function loadAuthn(
    infra: CheckAuthTicketInfra,
    post: Post<RenewAuthTicketEvent>,
    hook: { (authn: Authn): void },
) {
    const authn = infra.authn(authnRepositoryConverter)

    const findResult = authn.get()
    if (!findResult.success) {
        post({ type: "repository-error", err: findResult.err })
        return
    }
    if (!findResult.found) {
        post({ type: "required-to-login" })
        return
    }

    hook(findResult.value)
}
async function renew(infra: CheckAuthTicketInfra, info: Authn, post: Post<RenewAuthTicketEvent>) {
    const { clock, config } = infra
    const authn = infra.authn(authnRepositoryConverter)
    const authz = infra.authz(authzRepositoryConverter)
    const renew = infra.renew(authRemoteConverter(clock))

    post({ type: "try-to-renew" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に take longtime イベントを発行
    const response = await delayedChecker(renew(info.nonce), config.takeLongtimeThreshold, () =>
        post({ type: "take-longtime-to-renew" }),
    )
    if (!response.success) {
        if (response.err.type === "invalid-ticket") {
            const removeResult = authn.remove()
            if (!removeResult.success) {
                post({ type: "repository-error", err: removeResult.err })
                return
            }
            post({ type: "required-to-login" })
            return
        }
        post({ type: "failed-to-renew", err: response.err })
        return
    }

    if (!checkRepositoryError(authn.set(response.value.authn))) {
        return
    }
    if (!checkRepositoryError(authz.set(response.value.authz))) {
        return
    }

    post({ type: "succeed-to-renew", auth: response.value })

    function checkRepositoryError(result: StoreRepositoryResult): boolean {
        if (!result.success) {
            post({ type: "repository-error", err: result.err })
        }
        return result.success
    }
}

export function renewAuthTicketEventHasDone(event: RenewAuthTicketEvent): boolean {
    switch (event.type) {
        case "required-to-login":
        case "failed-to-renew":
        case "repository-error":
        case "succeed-to-renew":
            return true

        case "try-to-renew":
        case "take-longtime-to-renew":
            return false
    }
}

interface Post<T> {
    (event: T): void
}
