import { StoreResult } from "../../../../common/storage/infra"
import {
    RenewAuthnInfoActionInfra_legacy,
    RenewAuthnInfo,
    ForceRenewAuthnInfo,
    RenewAuthnInfoInfra,
} from "./infra"

import { RenewAuthnInfoAction_legacy } from "./action"

import { ForceRequestRenewAuthnInfoEvent } from "./event"

import { hasExpired, LastAuth } from "../common/data"

export function initRenewAuthnInfoAction_legacy(
    infra: RenewAuthnInfoActionInfra_legacy
): RenewAuthnInfoAction_legacy {
    return {
        request: renewAuthnInfo(infra),
        forceRequest: forceRenewAuthnInfo(infra),
    }
}

export const renewAuthnInfo: RenewAuthnInfo = (infra) => async (post) => {
    const { clock, config } = infra

    loadLastLogin(infra, post, (lastLogin) => {
        const time = {
            now: clock.now(),
            expire_millisecond: config.instantLoadExpire.expire_millisecond,
        }
        if (hasExpired(lastLogin.lastAuthAt, time)) {
            renew(infra, lastLogin, post)
            return
        }

        post({ type: "try-to-instant-load" })
    })
}

export const forceRenewAuthnInfo: ForceRenewAuthnInfo = (infra) => async (post) => {
    loadLastLogin(infra, post, (lastLogin) => {
        renew(infra, lastLogin, post)
    })
}

function loadLastLogin(
    infra: RenewAuthnInfoInfra,
    post: Post<ForceRequestRenewAuthnInfoEvent>,
    hook: { (lastLogin: LastAuth): void }
) {
    const { authnInfos } = infra

    const findResult = authnInfos.load()
    if (!findResult.success) {
        post({ type: "storage-error", err: findResult.err })
        return
    }
    if (!findResult.found) {
        post({ type: "required-to-login" })
        return
    }

    hook(findResult.lastAuth)
}
async function renew(
    infra: RenewAuthnInfoInfra,
    lastLogin: LastAuth,
    post: Post<ForceRequestRenewAuthnInfoEvent>
) {
    const { apiCredentials, authnInfos, renew, config, delayed } = infra

    post({ type: "try-to-renew" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(renew(lastLogin.authnNonce), config.delay, () =>
        post({ type: "delayed-to-renew" })
    )
    if (!response.success) {
        if (response.err.type === "invalid-ticket") {
            const removeResult = authnInfos.remove()
            if (!removeResult.success) {
                post({ type: "storage-error", err: removeResult.err })
                return
            }
            post({ type: "required-to-login" })
            return
        }
        post({ type: "failed-to-renew", err: response.err })
        return
    }

    if (!checkStorageError(authnInfos.store(response.value.auth))) {
        return
    }
    if (!checkStorageError(apiCredentials.store(response.value.api))) {
        return
    }

    post({ type: "succeed-to-renew", authnInfo: response.value.auth })

    function checkStorageError(result: StoreResult): boolean {
        if (!result.success) {
            post({ type: "storage-error", err: result.err })
        }
        return result.success
    }
}

interface Post<T> {
    (event: T): void
}
