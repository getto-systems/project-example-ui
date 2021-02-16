import { newSubmitPasswordLoginRemoteAccess } from "../infra/remote/submitPasswordLogin/main"

import { delayed } from "../../../../../z_infra/delayed/core"
import { delaySecond } from "../../../../../z_infra/time/infra"

import { initPasswordLoginAction, initPasswordLoginActionPod } from "../impl"

import { PasswordLoginAction, PasswordLoginActionPod } from "../action"

export function newPasswordLoginAction(): PasswordLoginAction {
    return initPasswordLoginAction(newPasswordLoginActionPod())
}
export function newPasswordLoginActionPod(): PasswordLoginActionPod {
    return initPasswordLoginActionPod({
        login: newSubmitPasswordLoginRemoteAccess(),
        config: {
            delay: delaySecond(1),
        },
        delayed,
    })
}
