import { delayed, wait } from "../../../../../../z_infra/delayed/core"

import { checkStatus, startSession } from "../impl/core"

import {
    GetStatusRemoteAccess,
    PasswordResetSessionActionConfig,
    SendTokenRemoteAccess,
    StartSessionRemoteAccess,
} from "../infra"

import { ResetSessionAction } from "../action"

export function initTestPasswordResetSessionAction(
    config: PasswordResetSessionActionConfig,
    remote: Readonly<{
        startSession: StartSessionRemoteAccess
        sendToken: SendTokenRemoteAccess
        getStatus: GetStatusRemoteAccess
    }>
): ResetSessionAction {
    return {
        startSession: startSession({
            startSession: remote.startSession,
            config: config.startSession,
            delayed,
        }),
        checkStatus: checkStatus({
            sendToken: remote.sendToken,
            getStatus: remote.getStatus,
            config: config.checkStatus,
            delayed,
            wait,
        }),
    }
}
