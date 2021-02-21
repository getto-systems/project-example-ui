import { ValidateBoardAction } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { LoginIDBoardFieldAction } from "../../../../../../../common/board/loginID/x_Action/LoginID/action"

import { PasswordResetSessionFields } from "../../../data"

export interface StartPasswordResetSessionFormAction {
    readonly loginID: LoginIDBoardFieldAction
    readonly validate: StartPasswordResetSessionValidateAction
    readonly clear: ClearAction
}

export type StartPasswordResetSessionValidateAction = ValidateBoardAction<
    PasswordResetSessionFields
>

interface ClearAction {
    (): void
}
