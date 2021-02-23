import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"

import { ResetPasswordAction, ResetPasswordEntryPoint } from "./action"

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
