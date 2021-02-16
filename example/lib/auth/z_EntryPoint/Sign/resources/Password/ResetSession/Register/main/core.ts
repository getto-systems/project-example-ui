import { newRegisterPasswordResetSessionAction } from "../../../../../../../sign/x_Action/Password/Reset/Register/Core/main/core"
import { newRegisterPasswordResetSessionFormAction } from "../../../../../../../sign/x_Action/Password/Reset/Register/Form/main"

import {
    AuthSignPasswordResetSessionRegisterBackgroundResource,
    AuthSignPasswordResetSessionRegisterResource,
} from "../resource"

export function newAuthSignPasswordResetSessionRegisterResource(
    webStorage: Storage
): AuthSignPasswordResetSessionRegisterResource {
    return newAuthSignPasswordResetSessionRegisterResource_merge({
        register: newRegisterPasswordResetSessionAction(webStorage),
    })
}
export function newAuthSignPasswordResetSessionRegisterResource_merge(
    background: AuthSignPasswordResetSessionRegisterBackgroundResource
): AuthSignPasswordResetSessionRegisterResource {
    return {
        ...background,
        form: newRegisterPasswordResetSessionFormAction(),
    }
}
