import { ApplicationAction } from "../../../../../../../z_vendor/getto-application/action/action"
import { InputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/action"
import {
    ValidateBoardFieldAction,
    ValidateBoardFieldState,
} from "../../../../../../../z_vendor/getto-application/board/validateField/Action/Core/action"

import { ValidateLoginIDError } from "../../../convert"

import { LoginID } from "../../../data"

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
