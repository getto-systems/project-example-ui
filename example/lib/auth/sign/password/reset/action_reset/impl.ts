import { initSignLinkResource } from "../../../common/nav/action_nav/impl"

import { ResetPasswordAction, ResetPasswordEntryPoint } from "./entry_point"
import { ResetPasswordCoreAction } from "./core/action"
import { ResetPasswordFormAction } from "./form/action"

export function initResetPasswordEntryPoint(
    actions: Readonly<{
        core: ResetPasswordCoreAction
        form: ResetPasswordFormAction
    }>,
): ResetPasswordEntryPoint {
    const action = initAction(actions)
    return {
        resource: { reset: action, ...initSignLinkResource() },
        terminate: () => action.terminate(),
    }
}

function initAction(
    actions: Readonly<{
        core: ResetPasswordCoreAction
        form: ResetPasswordFormAction
    }>,
): ResetPasswordAction {
    return {
        ...actions,
        terminate: () => {
            actions.core.terminate()
            actions.form.terminate()
        },
    }
}
