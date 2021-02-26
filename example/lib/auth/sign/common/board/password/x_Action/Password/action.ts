import { InputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/action"
import {
    ValidateBoardFieldAction,
    ValidateBoardFieldState,
} from "../../../../../../../z_vendor/getto-application/board/validateField/x_Action/ValidateField/action"

import { Password } from "../../../../password/data"
import { PasswordCharacterState, ValidatePasswordError } from "./data"
import { CheckPasswordCharacterMethod } from "../../checkCharacter/method"
import { ApplicationAction } from "../../../../../../../z_vendor/getto-application/action/action"

export type PasswordBoardFieldResource = Readonly<{
    field: PasswordBoardFieldAction
}>

export interface PasswordBoardFieldAction extends ApplicationAction {
    readonly resource: InputBoardValueResource
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
