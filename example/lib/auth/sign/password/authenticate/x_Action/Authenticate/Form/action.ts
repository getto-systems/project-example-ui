import { ApplicationAction } from "../../../../../../../z_getto/application/action"
import { ValidateBoardAction } from "../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { LoginIDBoardFieldAction } from "../../../../../../common/board/loginID/x_Action/LoginID/action"
import { PasswordBoardFieldAction } from "../../../../../../common/board/password/x_Action/Password/action"

import { AuthenticatePasswordFields } from "../../../data"

export interface AuthenticatePasswordFormAction extends ApplicationAction {
    readonly loginID: LoginIDBoardFieldAction
    readonly password: PasswordBoardFieldAction
    readonly validate: AuthenticatePasswordValidateAction
    readonly clear: ClearAction
}

export type AuthenticatePasswordValidateAction = ValidateBoardAction<AuthenticatePasswordFields>

interface ClearAction {
    (): void
}
