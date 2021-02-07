import { ApplicationComponent } from "../../getto-example/application/component"
import { FormHistoryStack, FormInput, FormValidationStateSet } from "../action/action"

import { FormHistory, FormHistoryState, FormValidationState } from "../action/data"
import { FormInputString, FormValidationResult, markInputString } from "../data"

export type FormMaterial = Readonly<{
    validation: FormValidationStateSet
    history: FormHistoryStack
}>
export type FormComponentState = Readonly<{
    validation: FormValidationState
    history: FormHistoryState
}>
export const initialFormComponentState: FormComponentState = {
    validation: "initial",
    history: { undo: false, redo: false },
}

export interface FormFieldComponent<S, E> extends ApplicationComponent<FormFieldState<S, E>> {
    validate(): void
}

export type FormFieldState<S, E> = S & Readonly<{ result: FormValidationResult<E> }>
export type FormFieldEmptyState = {
    // no state
}
export const initialFormFieldComponentState = { result: { valid: true } } as const

export type FormInputMaterial = Readonly<{
    input: FormInput
}>
export interface FormInputComponent extends ApplicationComponent<FormInputComponentState> {
    input(value: FormInputString): void
    change(): void
    restore(history: FormHistory): void
}

export type FormInputComponentState = Readonly<{ value: FormInputString }>
export const initialFormInputComponentState: FormInputComponentState = { value: markInputString("") }
