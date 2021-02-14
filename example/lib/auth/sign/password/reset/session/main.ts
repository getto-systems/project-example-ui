import { newSendTokenRemoteAccess } from "./infra/remote/sendToken/main"
import { newGetStatusRemoteAccess } from "./infra/remote/getStatus/main"
import { newStartSessionRemoteAccess } from "./infra/remote/startSession/main"

import { delayed, wait } from "../../../../../z_infra/delayed/core"
import { delaySecond, limit, waitSecond } from "../../../../../z_infra/time/infra"

import { initSessionActionPod } from "./impl"

import { SessionActionPod } from "./action"

export function newSessionActionPod(): SessionActionPod {
    return initSessionActionPod({
        sendToken: newSendTokenRemoteAccess(),
        getStatus: newGetStatusRemoteAccess(),
        startSession: newStartSessionRemoteAccess(),
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
}
