import { InputPasswordAction, ValidatePasswordState } from "./Core/action"

export type InputPasswordResource = Readonly<{
    field: InputPasswordAction
}>

export type InputPasswordResourceState = Readonly<{
    state: ValidatePasswordState
}>
