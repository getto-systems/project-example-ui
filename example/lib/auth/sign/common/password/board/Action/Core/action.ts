import { InputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/action"
import {
    ValidateBoardFieldAction,
    ValidateBoardFieldState,
} from "../../../../../../../z_vendor/getto-application/board/validateField/Action/Core/action"

import { ValidatePasswordError } from "../../../convert"

import { Password, PasswordCharacterState } from "../../../data"
import { ApplicationAction } from "../../../../../../../z_vendor/getto-application/action/action"

export interface InputPasswordAction extends ApplicationAction {
    readonly board: InputBoardValueResource
    readonly validate: ValidatePasswordAction
    readonly clear: ClearAction
    readonly checkCharacter: CheckPasswordCharacterAction
}

export type ValidatePasswordAction = ValidateBoardFieldAction<Password, ValidatePasswordError>
export type ValidatePasswordState = ValidateBoardFieldState<ValidatePasswordError>

interface ClearAction {
    (): void
}
interface CheckPasswordCharacterAction {
    (): PasswordCharacterState
}
