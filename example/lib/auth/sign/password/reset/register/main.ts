import { newRegisterRemoteAccess } from "./infra/remote/register/main"

import { delayed } from "../../../../../z_infra/delayed/core"
import { delaySecond } from "../../../../../z_infra/time/infra"

import { initRegisterActionPod } from "./impl"

import { RegisterActionPod } from "./action"

export function newRegisterActionPod(): RegisterActionPod {
    return initRegisterActionPod({
        register: newRegisterRemoteAccess(),
        config: {
            delay: delaySecond(1),
        },
        delayed,
    })
}
