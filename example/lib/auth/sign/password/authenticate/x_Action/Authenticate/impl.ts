import { newAuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/impl"
import { terminateLoginIDBoardFieldAction } from "../../../../../common/board/loginID/x_Action/LoginID/impl"
import { terminatePasswordBoardFieldAction } from "../../../../../common/board/password/x_Action/Password/impl"

import { AuthenticatePasswordEntryPoint, AuthenticatePasswordAction } from "./action"

export function toAuthenticatePasswordEntryPoint(
    resource: AuthenticatePasswordAction
): AuthenticatePasswordEntryPoint {
    return {
        resource: { ...resource, ...newAuthSignLinkResource() },
        terminate: () => {
            resource.core.terminate()
            resource.form.validate.terminate()
            terminateLoginIDBoardFieldAction(resource.form.loginID)
            terminatePasswordBoardFieldAction(resource.form.password)
        },
    }
}
