import { newAuthenticatePasswordAction } from "../../../../../sign/x_Action/Password/Authenticate/Core/main/core"
import { newAuthenticatePasswordFormAction } from "../../../../../sign/x_Action/Password/Authenticate/Form/main"

import {
    AuthenticatePasswordBackgroundResource,
    AuthenticatePasswordResource,
} from "../resource"

export function newPasswordAuthenticateResource(
    webStorage: Storage
): AuthenticatePasswordResource {
    return newPasswordAuthenticateResource_merge({
        authenticate: newAuthenticatePasswordAction(webStorage),
    })
}
export function newPasswordAuthenticateResource_merge(
    background: AuthenticatePasswordBackgroundResource
): AuthenticatePasswordResource {
    return {
        ...background,
        form: newAuthenticatePasswordFormAction(),
    }
}
