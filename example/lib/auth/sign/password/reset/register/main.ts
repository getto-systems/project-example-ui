import { newRegisterRemoteAccess } from "./infra/remote/register/main"

import { delayed } from "../../../../../z_infra/delayed/core"
import { delaySecond } from "../../../../../z_infra/time/infra"

import { initRegisterAction, initRegisterActionLocationInfo, initRegisterActionPod } from "./impl"

import { RegisterAction, RegisterActionLocationInfo, RegisterActionPod } from "./action"
import { currentURL } from "../../../../../z_infra/location/url"

export function newRegisterAction(pod: RegisterActionPod): RegisterAction {
    return initRegisterAction(newRegisterActionLocationInfo(), pod)
}
export function newRegisterActionPod(): RegisterActionPod {
    return initRegisterActionPod({
        register: newRegisterRemoteAccess(),
        config: {
            delay: delaySecond(1),
        },
        delayed,
    })
}

export function newRegisterActionLocationInfo(): RegisterActionLocationInfo {
    return initRegisterActionLocationInfo(currentURL())
}
