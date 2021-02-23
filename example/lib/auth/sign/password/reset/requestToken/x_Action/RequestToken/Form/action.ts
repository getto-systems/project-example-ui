import { ApplicationAction } from "../../../../../../../../z_getto/application/action"
import { ValidateBoardAction } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { LoginIDBoardFieldAction } from "../../../../../../common/board/loginID/x_Action/LoginID/action"

import { RequestTokenFields } from "../../../data"

export interface FormAction extends ApplicationAction {
    readonly loginID: LoginIDBoardFieldAction
    readonly validate: ValidateRequestTokenAction
    readonly clear: ClearAction
}

export type ValidateRequestTokenAction = ValidateBoardAction<RequestTokenFields>

interface ClearAction {
    (): void
}
