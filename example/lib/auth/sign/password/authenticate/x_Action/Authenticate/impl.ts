import { newAuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/impl"
import { terminateLoginIDBoardResource } from "../../../../../common/board/loginID/x_Action/LoginID/impl"
import { terminatePasswordBoardResource } from "../../../../../common/board/password/x_Action/Password/impl"

import { AuthenticatePasswordEntryPoint, AuthenticatePasswordResource } from "./action"

export function toAuthenticatePasswordEntryPoint(
    resource: AuthenticatePasswordResource
): AuthenticatePasswordEntryPoint {
    return {
        resource: { ...resource, ...newAuthSignLinkResource() },
        terminate: () => {
            resource.core.terminate()
            resource.form.validate.terminate()
            terminateLoginIDBoardResource(resource.form.loginID)
            terminatePasswordBoardResource(resource.form.password)
        },
    }
}
