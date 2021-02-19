import { ValidateBoardAction } from "../../../../../../../common/vendor/getto-board/validateBoard/x_Action/ValidateBoard/action"
import { LoginIDBoardAction } from "../../../../../../common/board/loginID/x_Action/LoginID/action"
import { PasswordBoardResource } from "../../../../../../common/board/password/x_Action/Password/action"

import { AuthenticatePasswordFields } from "../../../data"

export type AuthenticatePasswordFormResource = Readonly<{
    loginID: LoginIDBoardAction
    password: PasswordBoardResource
    validate: AuthenticatePasswordFormAction
}>

export type AuthenticatePasswordFormAction = ValidateBoardAction<AuthenticatePasswordFields>
