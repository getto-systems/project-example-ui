import { FormInputString, FormValidationResult } from "../data"

export type FormHistoryPath = Readonly<{ field: FormFieldName; input: FormInputName }>
export type FormFieldName = string
export type FormInputName = string

export type FormValidationState = "initial" | "valid" | "invalid"

export function mapValidationResult<E>(result: FormValidationResult<E>): FormValidationState {
    if (result.valid) {
        return "valid"
    } else {
        return "invalid"
    }
}

export type FormHistory = Readonly<{ previous: FormHistoryPrevious; current: FormInputString }>
export type FormHistoryPrevious =
    | Readonly<{ type: "first" }>
    | Readonly<{ type: "hasPrevious"; history: FormHistory }>

export type FormInputHistory = Readonly<{ history: FormHistory; input: FormInputName }>

export type FormHistoryState = Readonly<{ undo: boolean; redo: boolean }>

export type FormHistoryStackItem = Readonly<{ history: FormHistory; path: FormHistoryPath }>
export type FormHistoryRestoreResult =
    | Readonly<{ type: "disabled" }>
    | Readonly<{ type: "enabled"; item: FormHistoryStackItem }>
