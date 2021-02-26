import { ApplicationAction } from "../../../../../../../../z_getto/action/action"
import { LoginIDBoardFieldAction } from "../../../../../../common/board/loginID/x_Action/LoginID/action"
import { PasswordBoardFieldAction } from "../../../../../../common/board/password/x_Action/Password/action"
import { ValidateBoardAction } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"

import { ResetFields } from "../../../data"

export interface FormAction extends ApplicationAction {
    readonly loginID: LoginIDBoardFieldAction
    readonly password: PasswordBoardFieldAction
    readonly validate: ValidateResetAction
    readonly clear: ClearAction
}

export type ValidateResetAction = ValidateBoardAction<ResetFields>

interface ClearAction {
    (): void
}
