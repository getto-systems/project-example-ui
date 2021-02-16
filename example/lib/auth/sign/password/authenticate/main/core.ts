import { newAuthenticatePasswordRemoteAccess } from "../infra/remote/authenticate/main"

import { delayed } from "../../../../../z_infra/delayed/core"
import { delaySecond } from "../../../../../z_infra/time/infra"

import { initPasswordLoginAction_legacy, initPasswordLoginActionPod_legacy } from "../impl"

import { AuthenticatePasswordAction_legacy, AuthenticatePasswordActionPod_legacy } from "../action"

export function newPasswordLoginAction(): AuthenticatePasswordAction_legacy {
    return initPasswordLoginAction_legacy(newPasswordLoginActionPod())
}
export function newPasswordLoginActionPod(): AuthenticatePasswordActionPod_legacy {
    return initPasswordLoginActionPod_legacy({
        login: newAuthenticatePasswordRemoteAccess(),
        config: {
            delay: delaySecond(1),
        },
        delayed,
    })
}
