import { InputBoardValueAction } from "../../../../../../z_getto/board/input/x_Action/Input/action"
import {
    ValidateBoardFieldAction,
    ValidateBoardFieldState,
} from "../../../../../../z_getto/board/validateField/x_Action/ValidateField/action"
import { ApplicationAction } from "../../../../../../z_getto/application/action"
import { TogglePasswordDisplayEvent } from "../../toggleDisplay/event"
import {
    HidePasswordDisplayMethod,
    ShowPasswordDisplayMethod,
} from "../../toggleDisplay/method"

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
    readonly toggle: TogglePasswordDisplayBoardAction
    readonly passwordCharacter: CheckPasswordCharacterAction
}

export type ValidatePasswordAction = ValidateBoardFieldAction<Password, ValidatePasswordError>
export type ValidatePasswordState = ValidateBoardFieldState<ValidatePasswordError>

export interface TogglePasswordDisplayBoardAction
    extends ApplicationAction<TogglePasswordDisplayBoardState> {
    show(): void
    hide(): void
}

export type TogglePasswordDisplayBoardMaterial = Readonly<{
    show: ShowPasswordDisplayMethod
    hide: HidePasswordDisplayMethod
}>

export type TogglePasswordDisplayBoardState = TogglePasswordDisplayEvent

export const initialTogglePasswordDisplayBoardState: TogglePasswordDisplayBoardState = {
    visible: false,
}

export interface CheckPasswordCharacterAction {
    check(): PasswordCharacterState
}

export type CheckPasswordCharacterMaterial = Readonly<{
    check: CheckPasswordCharacterMethod
}>

interface ClearAction {
    (): void
}
