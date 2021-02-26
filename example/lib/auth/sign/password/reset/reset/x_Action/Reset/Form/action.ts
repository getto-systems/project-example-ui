import { ApplicationAction } from "../../../../../../../../z_vendor/getto-application/action/action"
import { InputLoginIDAction } from "../../../../../../common/board/loginID/Action/Core/action"
import { InputPasswordAction } from "../../../../../../common/board/password/Action/Core/action"
import { ValidateBoardAction } from "../../../../../../../../z_vendor/getto-application/board/validateBoard/x_Action/ValidateBoard/action"

import { ResetFields } from "../../../data"

export interface FormAction extends ApplicationAction {
    readonly loginID: InputLoginIDAction
    readonly password: InputPasswordAction
    readonly validate: ValidateResetAction
    readonly clear: ClearAction
}

export type ValidateResetAction = ValidateBoardAction<ResetFields>

interface ClearAction {
    (): void
}
