import { newAuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/impl"
import { terminateLoginIDBoardFieldAction } from "../../../../../common/board/loginID/x_Action/LoginID/impl"
import { terminatePasswordBoardFieldAction } from "../../../../../common/board/password/x_Action/Password/impl"

import { AuthenticatePasswordEntryPoint, AuthenticatePasswordAction } from "./action"

export function toAuthenticatePasswordEntryPoint(
    action: AuthenticatePasswordAction
): AuthenticatePasswordEntryPoint {
    return {
        resource: { authenticate: action, ...newAuthSignLinkResource() },
        terminate: () => {
            action.core.terminate()
            action.form.validate.terminate()
            terminateLoginIDBoardFieldAction(action.form.loginID)
            terminatePasswordBoardFieldAction(action.form.password)
        },
    }
}
