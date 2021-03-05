import { initSignLinkResource } from "../../../../common/link/Action/impl"

import { ResetPasswordAction, ResetPasswordEntryPoint } from "./action"
import { ResetPasswordCoreAction } from "./Core/action"
import { ResetPasswordFormAction } from "./Form/action"

export function toResetPasswordEntryPoint(action: ResetPasswordAction): ResetPasswordEntryPoint {
    return {
        resource: { reset: action, ...initSignLinkResource() },
        terminate: () => action.terminate(),
    }
}

export function toAction(
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
