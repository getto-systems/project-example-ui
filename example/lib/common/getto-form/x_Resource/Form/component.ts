import { ApplicationComponent } from "../../../getto-example/Application/component"

import { FormHistoryStack, FormInput, FormValidationStateSet } from "../../form/action"

import {
    emptyInputString,
    FormHistory,
    FormHistoryPath,
    FormHistoryState,
    FormInputHistory,
    FormInputString,
    FormValidationResult,
    FormValidationState,
} from "../../form/data"

export type FormContainerMaterial = Readonly<{
    validation: FormValidationStateSet
    history: FormHistoryStack
}>

export interface FormContainerComponent extends ApplicationComponent<FormContainerComponentState> {
    undo(): void
    redo(): void
}
export type FormContainerComponentState = Readonly<{
    validation: FormValidationState
    history: FormHistoryState
}>
export const initialFormContainerComponentState: FormContainerComponentState = {
    validation: "initial",
    history: { undo: false, redo: false },
}

export interface FormInputFinder {
    (path: FormHistoryPath): FormInputFindResult
}
export type FormInputFindResult =
    | Readonly<{ found: false }>
    | Readonly<{ found: true; input: FormInputComponent }>

export interface FormFieldComponent<S, E> extends ApplicationComponent<FormFieldComponentState<S, E>> {
    validate(): void
}

export type FormFieldComponentState<S, E> = S & Readonly<{ result: FormValidationResult<E> }>
export type FormFieldEmptyState = {
    // no state
}
export const initialFormFieldComponentState = { result: { valid: true } } as const

export type FormFieldHandler = Readonly<{
    validate: Handler<FormValidationState>
    history: Handler<FormInputHistory>
}>

export type FormInputMaterial = Readonly<{
    input: FormInput
}>
export interface FormInputComponent extends ApplicationComponent<FormInputComponentState> {
    input(value: FormInputString): void
    change(): void
    restore(history: FormHistory): void
}

export type FormInputComponentState = Readonly<{ value: FormInputString }>
export const initialFormInputComponentState: FormInputComponentState = { value: emptyInputString() }

interface Handler<E> {
    (event: E): void
}
