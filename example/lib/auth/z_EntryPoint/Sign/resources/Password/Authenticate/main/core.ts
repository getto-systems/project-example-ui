import { newAuthenticatePasswordAction } from "../../../../../../sign/x_Action/Password/Authenticate/Core/main/core"
import { newAuthenticatePasswordFormAction } from "../../../../../../sign/x_Action/Password/Authenticate/Form/main"

import {
    AuthSignPasswordAuthenticateBackgroundResource,
    AuthSignPasswordAuthenticateResource,
} from "../resource"

export function newAuthSignPasswordAuthenticateResource(
    webStorage: Storage
): AuthSignPasswordAuthenticateResource {
    return newAuthSignPasswordAuthenticateResource_merge({
        authenticate: newAuthenticatePasswordAction(webStorage),
    })
}
export function newAuthSignPasswordAuthenticateResource_merge(
    background: AuthSignPasswordAuthenticateBackgroundResource
): AuthSignPasswordAuthenticateResource {
    return {
        ...background,
        form: newAuthenticatePasswordFormAction(),
    }
}
