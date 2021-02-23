import { newAuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/impl"

import { AuthenticatePasswordEntryPoint, AuthenticatePasswordAction } from "./action"

export function toAuthenticatePasswordEntryPoint(
    action: AuthenticatePasswordAction,
): AuthenticatePasswordEntryPoint {
    return {
        resource: { authenticate: action, ...newAuthSignLinkResource() },
        terminate: () => {
            action.core.terminate()
            action.form.validate.terminate()
            action.form.loginID.terminate()
            action.form.password.terminate()
        },
    }
}
