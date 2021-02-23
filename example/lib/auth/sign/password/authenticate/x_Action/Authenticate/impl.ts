import { newAuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/impl"

import { AuthenticatePasswordEntryPoint, AuthenticatePasswordAction } from "./action"
import { AuthenticatePasswordCoreAction } from "./Core/action"
import { AuthenticatePasswordFormAction } from "./Form/action"

export function toAuthenticatePasswordEntryPoint(
    action: AuthenticatePasswordAction,
): AuthenticatePasswordEntryPoint {
    return {
        resource: { authenticate: action, ...newAuthSignLinkResource() },
        terminate: () => action.terminate(),
    }
}

export function toAuthenticatePasswordAction(
    actions: Readonly<{
        core: AuthenticatePasswordCoreAction
        form: AuthenticatePasswordFormAction
    }>,
): AuthenticatePasswordAction {
    return {
        ...actions,
        terminate: () => {
            actions.core.terminate()
            actions.form.terminate()
        },
    }
}
