import { InputBoardValueAction } from "../../../../../../z_getto/board/input/x_Action/Input/action"
import {
    ValidateBoardFieldAction,
    ValidateBoardFieldState,
} from "../../../../../../z_getto/board/validateField/x_Action/ValidateField/action"

import { Password } from "../../../../password/data"
import { PasswordCharacterState, ValidatePasswordError } from "./data"
import { CheckPasswordCharacterMethod } from "../../checkCharacter/method"

export type PasswordBoardFieldResource = Readonly<{
    field: PasswordBoardFieldAction
}>

export interface PasswordBoardFieldAction {
    readonly input: InputBoardValueAction
    readonly validate: ValidatePasswordAction
    readonly clear: ClearAction
    readonly passwordCharacter: CheckPasswordCharacterAction
}

export type ValidatePasswordAction = ValidateBoardFieldAction<Password, ValidatePasswordError>
export type ValidatePasswordState = ValidateBoardFieldState<ValidatePasswordError>

export interface CheckPasswordCharacterAction {
    check(): PasswordCharacterState
}

export type CheckPasswordCharacterMaterial = Readonly<{
    check: CheckPasswordCharacterMethod
}>

interface ClearAction {
    (): void
}
