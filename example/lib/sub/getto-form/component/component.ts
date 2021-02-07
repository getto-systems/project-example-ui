import { ApplicationComponent } from "../../getto-example/application/component"
import { FormHistoryStack, FormInput, FormValidationStateSet } from "../action/action"

import { FormHistory, FormHistoryState, FormInputHistory, FormValidationState } from "../action/data"
import { FormInputString, FormValidationResult, markInputString } from "../data"

export type FormMaterial = Readonly<{
    validation: FormValidationStateSet
    history: FormHistoryStack
}>
export type FormState = Readonly<{
    validation: FormValidationState
    history: FormHistoryState
}>
export const initialFormState: FormState = {
    validation: "initial",
    history: { undo: false, redo: false },
}

export type FormFieldHandler = Readonly<{
    validate: Handler<FormValidationState>
    history: Handler<FormInputHistory>
}>

export interface FormFieldComponent<S, E> extends ApplicationComponent<FormFieldState<S, E>> {
    validate(): void
}

export type FormFieldState<S, E> = S & Readonly<{ result: FormValidationResult<E> }>
export type FormFieldEmptyState = {
    // no state
}
export const initialFormFieldState = { result: { valid: true } } as const

export type FormInputMaterial = Readonly<{
    input: FormInput
}>
export interface FormInputComponent extends ApplicationComponent<FormInputState> {
    input(value: FormInputString): void
    change(): void
    restore(history: FormHistory): void
}

export type FormInputState = Readonly<{ value: FormInputString }>
export const initialFormInputState: FormInputState = { value: markInputString("") }

interface Handler<E> {
    (event: E): void
}
