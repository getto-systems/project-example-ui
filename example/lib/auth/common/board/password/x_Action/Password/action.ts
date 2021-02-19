import { InputBoardAction } from "../../../../../../common/vendor/getto-board/input/x_Action/Input/action"
import {
    ValidateBoardAction,
    ValidateBoardState,
} from "../../../../../../common/vendor/getto-board/validate/x_Action/Validate/action"
import { ApplicationAction } from "../../../../../../common/vendor/getto-example/Application/action"
import { TogglePasswordDisplayBoardEvent } from "../../toggleDisplay/event"
import {
    HidePasswordDisplayBoardMethod,
    ShowPasswordDisplayBoardMethod,
} from "../../toggleDisplay/method"

import { PasswordCharacterState, ValidatePasswordError } from "./data"

export type PasswordBoardResource = Readonly<{
    validate: ValidatePasswordAction
    input: InputBoardAction
    toggle: TogglePasswordDisplayBoardAction
    characterState: PasswordCharacterStateDetecter
}>

export type ValidatePasswordAction = ValidateBoardAction<ValidatePasswordError>
export type ValidatePasswordState = ValidateBoardState<ValidatePasswordError>

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
