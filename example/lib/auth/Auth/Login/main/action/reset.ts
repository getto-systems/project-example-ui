import { delayed, wait } from "../../../../../z_infra/delayed/core"
import { initResetSimulateRemoteAccess } from "../../../../profile/passwordReset/impl/remote/reset/simulate"
import {
    initGetStatusSimulateRemoteAccess,
    initSendTokenSimulateRemoteAccess,
    initStartSessionSimulateRemoteAccess,
} from "../../../../profile/passwordReset/impl/remote/session/simulate"

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
    const targetSessionID = markSessionID("session-id")

    return {
        startSession: startSession({
            startSession: startSessionRemoteAccess(),
            config: config.startSession,
            delayed,
        }),
        checkStatus: checkStatus({
            sendToken: sendTokenRemoteAccess(),
            getStatus: getStatusRemoteAccess(),
            config: config.checkStatus,
            delayed,
            wait,
        }),
    }

    function startSessionRemoteAccess() {
        const targetLoginID = "loginID"

        return initStartSessionSimulateRemoteAccess(
            ({ loginID }) => {
                if (loginID !== targetLoginID) {
                    return { success: false, err: { type: "invalid-password-reset" } }
                }
                return { success: true, value: targetSessionID }
            },
            { wait_millisecond: 0 }
        )
    }
    function sendTokenRemoteAccess() {
        return initSendTokenSimulateRemoteAccess(() => ({ success: true, value: true }), {
            wait_millisecond: 0,
        })
    }
    function getStatusRemoteAccess() {
        return initGetStatusSimulateRemoteAccess(
            () => ({ success: true, value: { dest: { type: "log" }, done: true, send: true } }),
            { wait_millisecond: 0 }
        )
    }
}
export function initPasswordResetAction(config: PasswordResetActionConfig): PasswordResetAction {
    return {
        reset: reset({
            reset: resetRemoteAccess(),
            config: config.reset,
            delayed,
        }),
    }

    function resetRemoteAccess() {
        const targetLoginID = "loginID"
        const targetResetToken = "reset-token"

        return initResetSimulateRemoteAccess(
            ({ resetToken, fields: { loginID } }) => {
                if (resetToken !== targetResetToken) {
                    return { success: false, err: { type: "invalid-password-reset" } }
                }
                if (loginID !== targetLoginID) {
                    return { success: false, err: { type: "invalid-password-reset" } }
                }
                return {
                    success: true,
                    value: {
                        ticketNonce: markTicketNonce("ticket-nonce"),
                        apiCredential: markApiCredential({
                            apiRoles: ["admin", "development-document"],
                        }),
                        authAt: markAuthAt(new Date()),
                    },
                }
            },
            { wait_millisecond: 0 }
        )
    }
}
