import { authzRepositoryConverter } from "../../kernel/converter"
import { authnRepositoryConverter, authRemoteConverter } from "../../kernel/converter"

import { StoreRepositoryResult } from "../../../../z_vendor/getto-application/infra/repository/infra"
import { StartContinuousRenewInfra } from "../infra"

import { SaveAuthTicketMethod, StartContinuousRenewMethod } from "../method"

import { hasExpired } from "../../kernel/data"
import { StartContinuousRenewEvent } from "../event"

interface Save {
    (infra: StartContinuousRenewInfra): SaveAuthTicketMethod
}
export const saveAuthTicket: Save = (infra) => async (info, post) => {
    const authn = infra.authn(authnRepositoryConverter)
    const authz = infra.authz(authzRepositoryConverter)

    const authnResult = await authn.set(info.authn)
    if (!authnResult.success) {
        return post({ type: "failed-to-save", err: authnResult.err })
    }
    const authzResult = await authz.set(info.authz)
    if (!authzResult.success) {
        return post({ type: "failed-to-save", err: authzResult.err })
    }

    return post({ type: "succeed-to-save" })
}

interface Start {
    (infra: StartContinuousRenewInfra): StartContinuousRenewMethod
}
export const startContinuousRenew: Start = (infra) => async (post) => {
    const { config } = infra

    const timer = setInterval(async () => {
        // 設定された interval ごとに更新
        const result = await continuousRenew()
        if (!result.next) {
            clearInterval(timer)
        }
    }, config.interval.interval_millisecond)

    return post({ type: "succeed-to-start-continuous-renew" })

    async function continuousRenew(): Promise<{ next: boolean }> {
        const { clock, config } = infra
        const authz = infra.authz(authzRepositoryConverter)
        const authn = infra.authn(authnRepositoryConverter)
        const renew = infra.renew(authRemoteConverter(clock))

        const CANCEL = { next: false }
        const NEXT = { next: true }

        const result = await authn.get()
        if (!result.success) {
            post({ type: "repository-error", err: result.err })
            return CANCEL
        }
        if (!result.found) {
            handleStoreResult(await authn.remove())
            handleStoreResult(await authz.remove())
            return CANCEL
        }

        // 前回の更新時刻が新しければ今回は通信しない
        const time = { now: clock.now(), ...config.authnExpire }
        if (!hasExpired(result.value.authAt, time)) {
            post({ type: "authn-not-expired" })
            return NEXT
        }

        const response = await renew({ type: "always" })
        if (!response.success) {
            if (response.err.type === "unauthorized") {
                handleStoreResult(await authn.remove())
                handleStoreResult(await authz.remove())
                post({ type: "required-to-login" })
            } else {
                post({ type: "failed-to-continuous-renew", err: response.err })
            }
            return CANCEL
        }

        if (!handleStoreResult(await authn.set(response.value.authn))) {
            return CANCEL
        }
        if (!handleStoreResult(await authz.set(response.value.authz))) {
            return CANCEL
        }

        post({ type: "succeed-to-continuous-renew" })
        return NEXT
    }

    function handleStoreResult(result: StoreRepositoryResult): boolean {
        if (!result.success) {
            post({ type: "repository-error", err: result.err })
        }
        return result.success
    }
}

export function startContinuousRenewEventHasDone(event: StartContinuousRenewEvent): boolean {
    switch (event.type) {
        case "succeed-to-start-continuous-renew":
        case "authn-not-expired":
        case "succeed-to-continuous-renew":
            return false

        case "required-to-login":
        case "failed-to-continuous-renew":
        case "repository-error":
            return true
    }
}
