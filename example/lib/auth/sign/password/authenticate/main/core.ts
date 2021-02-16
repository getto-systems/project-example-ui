import { newAuthenticatePasswordRemoteAccess } from "../infra/remote/authenticate/main"

import { delayed } from "../../../../../z_infra/delayed/core"
import { delaySecond } from "../../../../../z_infra/time/infra"

import { initPasswordLoginAction, initPasswordLoginActionPod } from "../impl"

import { AuthenticatePasswordAction, AuthenticatePasswordActionPod } from "../action"

export function newPasswordLoginAction(): AuthenticatePasswordAction {
    return initPasswordLoginAction(newPasswordLoginActionPod())
}
export function newPasswordLoginActionPod(): AuthenticatePasswordActionPod {
    return initPasswordLoginActionPod({
        login: newAuthenticatePasswordRemoteAccess(),
        config: {
            delay: delaySecond(1),
        },
        delayed,
    })
}
