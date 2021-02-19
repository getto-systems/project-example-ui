import { InputBoardValueAction } from "../../../../../../common/vendor/getto-board/input/x_Action/Input/action"
import {
    ValidateBoardFieldAction,
    ValidateBoardFieldState,
} from "../../../../../../common/vendor/getto-board/validateField/x_Action/ValidateField/action"
import { ApplicationAction } from "../../../../../../common/vendor/getto-example/Application/action"
import { TogglePasswordDisplayBoardEvent } from "../../toggleDisplay/event"
import {
    HidePasswordDisplayBoardMethod,
    ShowPasswordDisplayBoardMethod,
} from "../../toggleDisplay/method"

import { Password } from "../../../../password/data"
import { PasswordCharacterState, ValidatePasswordError } from "./data"

export type PasswordBoardFieldResource = Readonly<{
    field: PasswordBoardFieldAction
}>

export type PasswordBoardFieldAction = Readonly<{
    validate: ValidatePasswordAction
    input: InputBoardValueAction
    toggle: TogglePasswordDisplayBoardAction
    characterState: PasswordCharacterStateDetecter
}>

export type ValidatePasswordAction = ValidateBoardFieldAction<Password, ValidatePasswordError>
export type ValidatePasswordState = ValidateBoardFieldState<ValidatePasswordError>

export interface TogglePasswordDisplayBoardAction
    extends ApplicationAction<TogglePasswordDisplayBoardState> {
    show(): void
    hide(): void
}

export type TogglePasswordDisplayBoardMaterial = Readonly<{
    show: ShowPasswordDisplayBoardMethod
    hide: HidePasswordDisplayBoardMethod
}>

export type TogglePasswordDisplayBoardState = TogglePasswordDisplayBoardEvent

export const initialTogglePasswordDisplayBoardState: TogglePasswordDisplayBoardState = {
    visible: false,
}

export interface PasswordCharacterStateDetecter {
    (): PasswordCharacterState
}
