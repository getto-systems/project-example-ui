import { newAuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/impl"
import { terminateLoginIDBoardAction } from "../../../../../common/board/loginID/x_Action/LoginID/impl"
import { terminatePasswordBoardFieldAction } from "../../../../../common/board/password/x_Action/Password/impl"

import { AuthenticatePasswordEntryPoint, AuthenticatePasswordResource } from "./action"

export function toAuthenticatePasswordEntryPoint(
    resource: AuthenticatePasswordResource
): AuthenticatePasswordEntryPoint {
    return {
        resource: { ...resource, ...newAuthSignLinkResource() },
        terminate: () => {
            resource.core.terminate()
            resource.form.validate.terminate()
            terminateLoginIDBoardAction(resource.form.loginID)
            terminatePasswordBoardFieldAction(resource.form.password)
        },
    }
}
