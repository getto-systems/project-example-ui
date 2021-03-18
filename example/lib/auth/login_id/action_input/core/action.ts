import { ApplicationAction } from "../../../../z_vendor/getto-application/action/action"
import { InputBoardValueResource } from "../../../../z_vendor/getto-application/board/action_input/action"
import {
    ValidateBoardFieldAction,
    ValidateBoardFieldState,
} from "../../../../z_vendor/getto-application/board/action_validate_field/core/action"

import { LoginID, ValidateLoginIDError } from "../../data"

export interface InputLoginIDAction extends ApplicationAction {
    readonly board: InputBoardValueResource
    readonly validate: ValidateLoginIDAction
    readonly clear: ClearAction
}

export type ValidateLoginIDAction = ValidateBoardFieldAction<LoginID, ValidateLoginIDError>
export type ValidateLoginIDState = ValidateBoardFieldState<ValidateLoginIDError>

interface ClearAction {
    (): void
}
