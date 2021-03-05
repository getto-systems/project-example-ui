import { initSignLinkResource } from "../../../../common/link/Action/impl"

import { ResetPasswordAction, ResetPasswordEntryPoint } from "./entryPoint"
import { ResetPasswordCoreAction } from "./Core/action"
import { ResetPasswordFormAction } from "./Form/action"

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
