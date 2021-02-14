import { delayed, wait } from "../../../../../../z_infra/delayed/core"
import { delaySecond, limit, waitSecond } from "../../../../../../z_infra/time/infra"
import { initResetSimulateRemoteAccess } from "../impl/remote/reset/simulate"
import {
    initGetStatusSimulateRemoteAccess,
    initSendTokenSimulateRemoteAccess,
    initStartSessionSimulateRemoteAccess,
} from "../impl/remote/session/simulate"

import { checkStatus, reset, startSession } from "../impl/core"

import { CheckStatusInfra, ResetInfra, StartSessionInfra } from "../infra"

import { ResetAction, ResetSessionAction } from "../action"

import { markSessionID } from "../data"
import { markAuthAt, markTicketNonce } from "../../../../authCredential/common/data"
import { markApiNonce, markApiRoles } from "../../../../../../common/auth/apiCredential/data"

export function initPasswordResetSessionAction(): ResetSessionAction {
    const targetSessionID = markSessionID("session-id")

    return {
        startSession: startSession(startSessionInfra()),
        checkStatus: checkStatus(checkStatusInfra()),
    }

    function startSessionInfra(): StartSessionInfra {
        return {
            startSession: startSessionRemoteAccess(),
            config: {
                delay: delaySecond(1),
            },
            delayed,
        }
    }
    function checkStatusInfra(): CheckStatusInfra {
        return {
            sendToken: sendTokenRemoteAccess(),
            getStatus: getStatusRemoteAccess(),
            config: {
                wait: waitSecond(0.25),
                limit: limit(40),
            },
            delayed,
            wait,
        }
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
export function initPasswordResetAction(): ResetAction {
    return {
        reset: reset(resetInfra()),
    }

    function resetInfra(): ResetInfra {
        return {
            reset: resetRemoteAccess(),
            config: {
                delay: delaySecond(1),
            },
            delayed,
        }
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
                        auth: {
                            ticketNonce: markTicketNonce("ticket-nonce"),
                            authAt: markAuthAt(new Date()),
                        },
                        api: {
                            apiNonce: markApiNonce("api-nonce"),
                            apiRoles: markApiRoles(["admin", "development-document"]),
                        },
                    },
                }
            },
            { wait_millisecond: 0 }
        )
    }
}
