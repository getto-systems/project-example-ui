import { ApplicationComponent } from "../../../../sub/getto-example/application/component"

import {
    FormFieldComponent,
    FormFieldHandler,
    FormFieldComponentState,
    FormInputComponent,
} from "../../../../sub/getto-form/component/component"

import {
    PasswordCharacterChecker,
    PasswordField,
    PasswordFormField,
    PasswordViewer,
} from "../../../common/field/password/action"

import { PasswordFieldEvent } from "../../../common/field/password/event"

import { PasswordValidationError, PasswordCharacter, PasswordView } from "../../../common/field/password/data"
import { InputValue, Valid, noError } from "../../../common/field/data"

export interface PasswordFormFieldComponentFactory {
    (material: PasswordFormFieldMaterial): { (handler: FormFieldHandler): PasswordFormFieldComponent }
}
export type PasswordFormFieldMaterial = Readonly<{
    password: PasswordFormField
    checker: PasswordCharacterChecker
    viewer: PasswordViewer
}>

export interface PasswordFormFieldComponent
    extends FormFieldComponent<PasswordState, PasswordValidationError> {
    readonly input: FormInputComponent
    show(): void
    hide(): void
}

export type PasswordFormFieldComponentState = FormFieldComponentState<PasswordState, PasswordValidationError>

export type PasswordState = Readonly<{
    character: PasswordCharacter
    view: PasswordView
}>

export const initialPasswordFormFieldComponentState: PasswordFormFieldComponentState = {
    result: { valid: true },
    character: { complex: false },
    view: { show: false },
}

export interface PasswordFieldComponentFactory {
    (material: PasswordFieldMaterial): PasswordFieldComponent
}
export type PasswordFieldMaterial = Readonly<{
    password: PasswordField
}>

export interface PasswordFieldComponent extends ApplicationComponent<PasswordFieldState> {
    set(inputValue: InputValue): void
    show(): void
    hide(): void
    validate(handler: Handler<PasswordFieldEvent>): void
}

export type PasswordFieldState = Readonly<{
    type: "succeed-to-update"
    result: Valid<PasswordValidationError>
    character: PasswordCharacter
    view: PasswordView
}>

export const initialPasswordFieldState: PasswordFieldState = {
    type: "succeed-to-update",
    result: noError(),
    character: { complex: false },
    view: { show: false },
}

interface Handler<T> {
    (state: T): void
}
