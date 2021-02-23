import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"
import { RequestPasswordResetTokenAction, RequestPasswordResetTokenEntryPoint } from "./action"
import { RequestPasswordResetTokenCoreAction } from "./Core/action"
import { RequestPasswordResetTokenFormAction } from "./Form/action"

export function toRequestPasswordResetTokenEntryPoint(
    action: RequestPasswordResetTokenAction,
): RequestPasswordResetTokenEntryPoint {
    return {
        resource: { request: action, ...newAuthSignLinkResource() },
        terminate: () => {
            action.core.terminate()
            action.form.validate.terminate()
            action.form.loginID.terminate()
        },
    }
}

export function toRequestPasswordResetTokenAction(
    actions: Readonly<{
        core: RequestPasswordResetTokenCoreAction
        form: RequestPasswordResetTokenFormAction
    }>,
): RequestPasswordResetTokenAction {
    return {
        ...actions,
        terminate: () => {
            actions.core.terminate()
            actions.form.terminate()
        },
    }
}
