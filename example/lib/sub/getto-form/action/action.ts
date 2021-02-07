import { FormChangeEvent, FormInputEvent } from "./event"

import { FormConvertResult, FormInputString, FormValidationResult } from "../data"
import { FormFieldName, FormHistory, FormHistoryPath, FormHistoryRestoreResult, FormHistoryState, FormValidationState } from "./data"

export interface FormAction {
    validation: FormValidationStateSetPod
    history: FormHistoryStackPod
}

export interface FormValidationStateSetPod {
    (): FormValidationStateSet
}
export interface FormValidationStateSet {
    update(name: FormFieldName, state: FormValidationState): void
    state(): FormValidationState
}

export interface FormHistoryStackPod {
    (): FormHistoryStack
}
export interface FormHistoryStack {
    push(path: FormHistoryPath, history: FormHistory): void

    state(): FormHistoryState

    undo(): FormHistoryRestoreResult
    undoEnabled(): boolean

    redo(): FormHistoryRestoreResult
    redoEnabled(): boolean
}

export interface FormField<T, E, I> {
    readonly input: I // FormInput or Record<Name, FormInput>
    validate(): FormValidationResult<E>
    convert(): FormConvertResult<T>
}

export interface FormInput {
    get(): FormInputString
    input(value: FormInputString, post: Post<FormInputEvent>): void
    change(post: Post<FormChangeEvent>): void
    restore(history: FormHistory, post: Post<FormInputEvent>): void
}

interface Post<E> {
    (event: E): void
}
