import { newLoginRemoteAccess } from "./infra/remote/login/main"

import { delayed } from "../../../../z_infra/delayed/core"
import { delaySecond } from "../../../../z_infra/time/infra"

import { initLoginActionPod } from "./impl"

import { LoginActionPod } from "./action"

export function newLoginActionPod(): LoginActionPod {
    return initLoginActionPod({
        login: newLoginRemoteAccess(),
        config: {
            delay: delaySecond(1),
        },
        delayed,
    })
}
