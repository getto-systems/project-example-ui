import { newSubmitPasswordResetRegisterRemoteAccess } from "../infra/remote/submitPasswordResetRegister/main"

import { delayed } from "../../../../../../z_infra/delayed/core"
import { delaySecond } from "../../../../../../z_infra/time/infra"

import {
    initPasswordResetRegisterAction,
    initPasswordResetRegisterActionLocationInfo,
    initRegisterActionPod,
} from "../impl"

import {
    PasswordResetRegisterAction,
    PasswordResetRegisterActionLocationInfo,
    PasswordResetRegisterActionPod,
} from "../action"
import { currentURL } from "../../../../../../z_infra/location/url"

export function newPasswordResetRegisterRegisterAction(
    pod: PasswordResetRegisterActionPod
): PasswordResetRegisterAction {
    return initPasswordResetRegisterAction(newLocationInfo(), pod)
}
export function newPasswordResetRegisterRegisterActionPod(): PasswordResetRegisterActionPod {
    return initRegisterActionPod({
        register: newSubmitPasswordResetRegisterRemoteAccess(),
        config: {
            delay: delaySecond(1),
        },
        delayed,
    })
}

function newLocationInfo(): PasswordResetRegisterActionLocationInfo {
    return initPasswordResetRegisterActionLocationInfo(currentURL())
}
