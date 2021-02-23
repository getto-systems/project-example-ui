import { newAuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/impl"

import { AuthenticatePasswordAction, AuthenticatePasswordEntryPoint } from "./action"
import { AuthenticatePasswordCoreAction } from "./Core/action"
import { AuthenticatePasswordFormAction } from "./Form/action"

export function toAuthenticatePasswordEntryPoint(
    action: AuthenticatePasswordAction,
): AuthenticatePasswordEntryPoint {
    return {
        // TODO newAuthSignLinkResource ではなく、 href: newSignHrefMaterial にしたい
        // TODO あるいは、引数で渡されるべきなのかも
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
