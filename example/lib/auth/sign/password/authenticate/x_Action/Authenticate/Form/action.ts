import { ValidateBoardAction } from "../../../../../../../common/vendor/getto-board/validateBoard/x_Action/ValidateBoard/action"
import { LoginIDBoardFieldAction } from "../../../../../../common/board/loginID/x_Action/LoginID/action"
import { PasswordBoardFieldAction } from "../../../../../../common/board/password/x_Action/Password/action"

import { AuthenticatePasswordFields } from "../../../data"

export type AuthenticatePasswordFormAction = Readonly<{
    loginID: LoginIDBoardFieldAction
    password: PasswordBoardFieldAction
    validate: AuthenticatePasswordValidateAction
    clear: ClearAction
}>

export type AuthenticatePasswordValidateAction = ValidateBoardAction<AuthenticatePasswordFields>

interface ClearAction {
    (): void
}
