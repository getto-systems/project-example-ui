import { initSignLinkResource } from "../../../common/link/Action/impl"

import { AuthenticatePasswordAction, AuthenticatePasswordEntryPoint } from "./entryPoint"
import { AuthenticatePasswordCoreAction } from "./Core/action"
import { AuthenticatePasswordFormAction } from "./Form/action"

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
