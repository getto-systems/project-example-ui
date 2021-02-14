import { delayed, wait } from "../../../../../z_infra/delayed/core"
import { delaySecond, limit, waitSecond } from "../../../../../z_infra/time/infra"
import {
    initGetStatusSimulateRemoteAccess,
    initSendTokenSimulateRemoteAccess,
    initStartSessionSimulateRemoteAccess,
} from "./infra/remote/session/simulate"

import { initSessionActionPod } from "./impl"

import { SessionActionPod } from "./action"

import { markSessionID } from "./data"

export function newSessionActionPod(): SessionActionPod {
    const targetSessionID = markSessionID("session-id")

    return initSessionActionPod({
        sendToken: sendTokenRemoteAccess(),
        getStatus: getStatusRemoteAccess(),
        startSession: startSessionRemoteAccess(),
        config: {
            startSession: {
                delay: delaySecond(1),
            },
            checkStatus: {
                wait: waitSecond(0.25),
                limit: limit(40),
            },
        },
        delayed,
        wait,
    })

    // TODO connect 実装を用意
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
