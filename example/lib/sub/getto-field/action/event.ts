import { FieldConvertResult, FieldInputString, FieldValidationError } from "../data"
import { FieldHistory } from "./data"

export type FieldConvertEvent<T> = Readonly<{
    type: "succeed-to-convert"
    result: FieldConvertResult<T>
}>
export type FieldValidateEvent<E> = Readonly<{
    type: "succeed-to-validate"
    err: FieldValidationError<E>
}>

export type FieldInputEvent = Readonly<{ type: "succeed-to-input"; value: FieldInputString }>
export type FieldChangeEvent = Readonly<{ type: "succeed-to-change"; history: FieldHistory }>
