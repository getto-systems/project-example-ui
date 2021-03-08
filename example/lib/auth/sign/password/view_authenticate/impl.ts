import { initSignLinkResource } from "../../common/link/action/impl"

import { AuthenticatePasswordAction, AuthenticatePasswordEntryPoint } from "./entry_point"
import { AuthenticatePasswordCoreAction } from "./core/action"
import { AuthenticatePasswordFormAction } from "./form/action"

export function toAuthenticatePasswordEntryPoint(
    actions: Readonly<{
        core: AuthenticatePasswordCoreAction
        form: AuthenticatePasswordFormAction
    }>,
): AuthenticatePasswordEntryPoint {
    const action = toAction(actions)
    return {
        resource: { authenticate: action, ...initSignLinkResource() },
        terminate: () => action.terminate(),
    }
}

function toAction(
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