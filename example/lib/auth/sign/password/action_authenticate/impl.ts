import { initSignLinkResource } from "../../common/nav/action_nav/impl"

import { AuthenticatePasswordAction, AuthenticatePasswordEntryPoint } from "./entry_point"
import { AuthenticatePasswordCoreAction } from "./core/action"
import { AuthenticatePasswordFormAction } from "./form/action"

export function initAuthenticatePasswordEntryPoint(
    actions: Readonly<{
        core: AuthenticatePasswordCoreAction
        form: AuthenticatePasswordFormAction
    }>,
): AuthenticatePasswordEntryPoint {
    const action = initAction(actions)
    return {
        resource: { authenticate: action, ...initSignLinkResource() },
        terminate: () => action.terminate(),
    }
}

function initAction(
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
