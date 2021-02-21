import { terminateLoginIDBoardFieldAction } from "../../../../../../common/board/loginID/x_Action/LoginID/impl"
import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"
import { StartPasswordResetSessionAction, StartPasswordResetSessionEntryPoint } from "./action"

export function toStartPasswordResetSessionEntryPoint(
    action: StartPasswordResetSessionAction,
): StartPasswordResetSessionEntryPoint {
    return {
        resource: { start: action, ...newAuthSignLinkResource() },
        terminate: () => {
            action.core.terminate()
            action.form.validate.terminate()
            terminateLoginIDBoardFieldAction(action.form.loginID)
        },
    }
}
