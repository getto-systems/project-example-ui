import { ApplicationAction } from "../../../../../../../../z_getto/application/action"
import { ValidateBoardAction } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { LoginIDBoardFieldAction } from "../../../../../../../common/board/loginID/x_Action/LoginID/action"

import { PasswordResetRequestFields } from "../../../data"

export interface RequestPasswordResetTokenFormAction extends ApplicationAction {
    readonly loginID: LoginIDBoardFieldAction
    readonly validate: RequestPasswordResetTokenValidateAction
    readonly clear: ClearAction
}

export type RequestPasswordResetTokenValidateAction = ValidateBoardAction<
    PasswordResetRequestFields
>

interface ClearAction {
    (): void
}
