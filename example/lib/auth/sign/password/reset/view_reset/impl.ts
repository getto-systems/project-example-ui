import { initSignLinkResource } from "../../../common/link/action/impl"

import { ResetPasswordAction, ResetPasswordEntryPoint } from "./entry_point"
import { ResetPasswordCoreAction } from "./core/action"
import { ResetPasswordFormAction } from "./form/action"

export function toResetPasswordEntryPoint(
    actions: Readonly<{
        core: ResetPasswordCoreAction
        form: ResetPasswordFormAction
    }>,
): ResetPasswordEntryPoint {
    const action = toAction(actions)
    return {
        resource: { reset: action, ...initSignLinkResource() },
        terminate: () => action.terminate(),
    }
}

function toAction(
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
