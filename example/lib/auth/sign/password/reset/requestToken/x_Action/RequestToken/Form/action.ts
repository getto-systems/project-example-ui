import { ApplicationAction } from "../../../../../../../../z_vendor/getto-application/action/action"
import { ValidateBoardAction } from "../../../../../../../../z_vendor/getto-application/board/validateBoard/x_Action/ValidateBoard/action"
import { InputLoginIDAction } from "../../../../../../common/board/loginID/Action/Core/action"

import { RequestTokenFields } from "../../../data"

export interface FormAction extends ApplicationAction {
    readonly loginID: InputLoginIDAction
    readonly validate: ValidateRequestTokenAction
    readonly clear: ClearAction
}

export type ValidateRequestTokenAction = ValidateBoardAction<RequestTokenFields>

interface ClearAction {
    (): void
}
