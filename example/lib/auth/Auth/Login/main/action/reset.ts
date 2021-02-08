import { delayed, wait } from "../../../../../z_infra/delayed/core"
import { initSimulatePasswordResetClient } from "../../../../profile/passwordReset/impl/remote/reset/simulate"
import { initSimulatePasswordResetSessionClient } from "../../../../profile/passwordReset/impl/remote/session/simulate"

import { checkStatus, reset, startSession } from "../../../../profile/passwordReset/impl/core"

import {
    PasswordResetActionConfig,
    PasswordResetSessionActionConfig,
} from "../../../../profile/passwordReset/infra"

import {
    PasswordResetAction,
    PasswordResetSessionAction,
} from "../../../../profile/passwordReset/action"

import { markApiCredential, markAuthAt, markTicketNonce } from "../../../../common/credential/data"
import { markSessionID } from "../../../../profile/passwordReset/data"

export function initPasswordResetSessionAction(
    config: PasswordResetSessionActionConfig
): PasswordResetSessionAction {
    const targetLoginID = "loginID"
    const targetSessionID = markSessionID("session-id")

    const sessionClient = initSimulatePasswordResetSessionClient({
        // エラーにする場合は StartSessionError を throw (それ以外を throw するとこわれる)
        async startSession({ loginID }) {
            if (loginID !== targetLoginID) {
                throw { type: "invalid-password-reset" }
            }
            return targetSessionID
        },
        // エラーにする場合は CheckStatusError を throw (それ以外を throw するとこわれる)
        async sendToken(post) {
            setTimeout(() => post({ state: "waiting" }), 0.3 * 1000)
            setTimeout(() => post({ state: "sending" }), 0.6 * 1000)
            setTimeout(() => post({ state: "success" }), 0.9 * 1000)
            return true
        },
        // エラーにする場合は CheckStatusError を throw (それ以外を throw するとこわれる)
        async getDestination(sessionID) {
            if (sessionID != targetSessionID) {
                throw { type: "invalid-password-reset" }
            }
            return { type: "log" }
        },
    })

    return {
        startSession: startSession({
            resetSession: sessionClient,
            config: config.startSession,
            delayed,
        }),
        checkStatus: checkStatus({
            reset: sessionClient,
            config: config.checkStatus,
            delayed,
            wait,
        }),
    }
}
export function initPasswordResetAction(config: PasswordResetActionConfig): PasswordResetAction {
    const targetLoginID = "loginID"
    const targetResetToken = "reset-token"

    const resetClient = initSimulatePasswordResetClient({
        // エラーにする場合は ResetError を throw (それ以外を throw するとこわれる)
        async reset(resetToken, { loginID }) {
            if (resetToken !== targetResetToken) {
                throw { type: "invalid-password-reset" }
            }
            if (loginID !== targetLoginID) {
                throw { type: "invalid-password-reset" }
            }
            return {
                ticketNonce: markTicketNonce("ticket-nonce"),
                apiCredential: markApiCredential({
                    apiRoles: ["admin", "development-docs"],
                }),
                authAt: markAuthAt(new Date()),
            }
        },
    })

    return {
        reset: reset({
            client: resetClient,
            config: config.reset,
            delayed,
        }),
    }
}
