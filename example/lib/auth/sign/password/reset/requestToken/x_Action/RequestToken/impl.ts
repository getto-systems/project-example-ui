import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"
import { RequestPasswordResetTokenAction, RequestPasswordResetTokenEntryPoint } from "./action"

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
