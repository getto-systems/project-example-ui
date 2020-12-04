import { RenewInfra, SetContinuousRenewInfra, StoreInfra, AuthCredentialRepository } from "../infra"

import { Renew, SetContinuousRenew, Store } from "../action"

import { TicketNonce } from "../../../common/credential/data"
import { LastLoginResponse } from "../data"

export const renew = (infra: RenewInfra): Renew => () => async (post) => {
    const { authCredentials, client, expires, time, delayed } = infra

    const lastLogin = findLastLogin(authCredentials)
    if (!lastLogin.success) {
        post({ type: "storage-error", err: lastLogin.err })
        return
    }
    if (!lastLogin.found) {
        post({ type: "required-to-login" })
        return
    }

    if (!expires.hasExceeded(lastLogin.content.lastLoginAt, time.instantLoadExpireTime)) {
        post({ type: "try-to-instant-load" })
        return
    }

    post({ type: "try-to-renew" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const renewResponse = await delayed(
        client.renew(lastLogin.content.ticketNonce),
        time.renewDelayTime,
        () => post({ type: "delayed-to-renew" })
    )
    if (!renewResponse.success) {
        post({ type: "failed-to-renew", err: renewResponse.err })
        return
    }
    if (!renewResponse.hasCredential) {
        const storeResponse = authCredentials.removeAuthCredential()
        if (!storeResponse.success) {
            post({ type: "storage-error", err: storeResponse.err })
            return
        }

        post({ type: "required-to-login" })
        return
    }

    const storeResponse = authCredentials.storeAuthCredential(renewResponse.authCredential)
    if (!storeResponse.success) {
        post({ type: "storage-error", err: storeResponse.err })
        return
    }

    post({ type: "succeed-to-renew" })
}
export const setContinuousRenew = (infra: SetContinuousRenewInfra): SetContinuousRenew => () => (
    post
) => {
    const { authCredentials, client, time, runner } = infra

    const lastLogin = findLastLogin(authCredentials)
    if (!lastLogin.success) {
        post({ type: "storage-error", err: lastLogin.err })
        return
    }
    if (!lastLogin.found) {
        post({ type: "required-to-login" })
        return
    }

    const { ticketNonce, lastLoginAt: lastAuthAt } = lastLogin.content

    setTimeout(async () => {
        if (await continuousRenew(ticketNonce)) {
            let lastState = true
            setInterval(async () => {
                // 失敗しないはずなので clearInterval しない
                if (lastState) {
                    lastState = await continuousRenew(ticketNonce)
                }
            }, time.renewIntervalTime.interval_millisecond)
        }
    }, runner.nextRun(lastAuthAt, time.renewRunDelayTime).delay_millisecond)

    async function continuousRenew(ticketNonce: TicketNonce): Promise<boolean> {
        // 画面へのフィードバックはしないので、イベントは発行しない
        const renewResponse = await client.renew(ticketNonce)
        if (!renewResponse.success) {
            return false
        }
        if (!renewResponse.hasCredential) {
            authCredentials.removeAuthCredential()
            return false
        }

        const storeResponse = authCredentials.storeAuthCredential(renewResponse.authCredential)
        if (!storeResponse.success) {
            return false
        }

        return true
    }
}
function findLastLogin(authCredentials: AuthCredentialRepository): LastLoginResponse {
    const ticketNonce = authCredentials.findTicketNonce()
    if (!ticketNonce.success) {
        return { success: false, err: ticketNonce.err }
    }
    if (!ticketNonce.found) {
        return { success: true, found: false }
    }

    const lastLoginAt = authCredentials.findLastLoginAt()
    if (!lastLoginAt.success) {
        return { success: false, err: lastLoginAt.err }
    }
    if (!lastLoginAt.found) {
        return { success: true, found: false }
    }

    return {
        success: true,
        found: true,
        content: {
            ticketNonce: ticketNonce.content,
            lastLoginAt: lastLoginAt.content,
        },
    }
}

export const store = (infra: StoreInfra): Store => () => async (authCredential, post) => {
    const { authCredentials } = infra
    const storeResponse = authCredentials.storeAuthCredential(authCredential)
    if (!storeResponse.success) {
        post({ type: "storage-error", err: storeResponse.err })
        return
    }
}
