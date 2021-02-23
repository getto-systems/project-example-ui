import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"

import { ResetPasswordAction, ResetPasswordEntryPoint } from "./action"
import { ResetPasswordCoreAction } from "./Core/action"
import { ResetPasswordFormAction } from "./Form/action"

export function toResetPasswordEntryPoint(action: ResetPasswordAction): ResetPasswordEntryPoint {
    return {
        resource: { reset: action, ...newAuthSignLinkResource() },
        terminate: () => {
            action.core.terminate()
            action.form.validate.terminate()
            action.form.loginID.terminate()
            action.form.password.terminate()
        },
    }
}

export function toResetPasswordAction(
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
