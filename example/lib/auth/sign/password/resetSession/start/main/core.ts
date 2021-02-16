import { newSendPasswordResetSessionTokenRemoteAccess } from "../infra/remote/sendPasswordResetSessionToken/main"
import { newGetPasswordResetSessionStatusRemoteAccess } from "../infra/remote/getPasswordResetSessionStatus/main"
import { newStartPasswordResetSessionRemoteAccess } from "../infra/remote/startPasswordResetSession/main"

import { delayed, wait } from "../../../../../../z_infra/delayed/core"
import { delaySecond, limit, waitSecond } from "../../../../../../z_infra/time/infra"

import { initPasswordResetSessionActionPod } from "../impl"

import { PasswordResetSessionActionPod } from "../action"

export function newPasswordResetSessionActionPod(): PasswordResetSessionActionPod {
    return initPasswordResetSessionActionPod({
        sendToken: newSendPasswordResetSessionTokenRemoteAccess(),
        getStatus: newGetPasswordResetSessionStatusRemoteAccess(),
        start: newStartPasswordResetSessionRemoteAccess(),
        config: {
            start: {
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
}
