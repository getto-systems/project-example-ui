import { newSubmitPasswordResetRegisterRemoteAccess } from "../infra/remote/submitPasswordResetRegister/main"

import { delayed } from "../../../../../../z_infra/delayed/core"
import { delaySecond } from "../../../../../../z_infra/time/infra"

import {
    initPasswordResetRegisterAction,
    initPasswordResetRegisterActionLocationInfo,
    initPasswordResetRegisterActionPod,
} from "../impl"

import {
    PasswordResetRegisterAction,
    PasswordResetRegisterActionLocationInfo,
    PasswordResetRegisterActionPod,
} from "../action"
import { currentURL } from "../../../../../../z_infra/location/url"

export function newPasswordResetRegisterAction(): PasswordResetRegisterAction {
    return initPasswordResetRegisterAction(newPasswordResetRegisterActionPod(), newLocationInfo())
}
export function newPasswordResetRegisterActionPod(): PasswordResetRegisterActionPod {
    return initPasswordResetRegisterActionPod({
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
