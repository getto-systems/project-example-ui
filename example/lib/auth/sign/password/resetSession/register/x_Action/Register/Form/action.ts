import { LoginIDBoardFieldAction } from "../../../../../../../common/board/loginID/x_Action/LoginID/action"
import { PasswordBoardFieldAction } from "../../../../../../../common/board/password/x_Action/Password/action"
import { ValidateBoardAction } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"

import { PasswordResetFields } from "../../../data"

export interface RegisterPasswordFormAction {
    readonly loginID: LoginIDBoardFieldAction
    readonly password: PasswordBoardFieldAction
    readonly validate: RegisterPasswordValidateAction
    readonly clear: ClearAction
}

export type RegisterPasswordValidateAction = ValidateBoardAction<PasswordResetFields>

interface ClearAction {
    (): void
}
