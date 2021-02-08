import { ApplicationComponent } from "../../../../sub/getto-example/application/component"
import {
    FormFieldComponent,
    FormFieldEmptyState,
    FormFieldHandler,
    FormFieldState,
    FormInputComponent,
} from "../../../../sub/getto-form/component/component"

import { LoginIDField, LoginIDFormField } from "../../../common/field/loginID/action"

import { LoginIDFieldEvent } from "../../../common/field/loginID/event"

import { InputValue, Valid, noError } from "../../../common/field/data"
import { LoginIDValidationError } from "../../../common/field/loginID/data"

export interface LoginIDFormFieldComponentFactory {
    (material: LoginIDFormFieldMaterial): { (handler: FormFieldHandler): LoginIDFormFieldComponent }
}
export type LoginIDFormFieldMaterial = Readonly<{
    field: LoginIDFormField
}>

export interface LoginIDFormFieldComponent
    extends FormFieldComponent<FormFieldEmptyState, LoginIDValidationError> {
    readonly input: FormInputComponent
}

export type LoginIDFormFieldState = FormFieldState<FormFieldEmptyState, LoginIDValidationError>

export interface LoginIDFieldComponentFactory {
    (material: LoginIDFieldMaterial): LoginIDFieldComponent
}
export type LoginIDFieldMaterial = Readonly<{
    loginID: LoginIDField
}>

export interface LoginIDFieldComponent extends ApplicationComponent<LoginIDFieldState> {
    set(inputValue: InputValue): void
    validate(handler: Handler<LoginIDFieldEvent>): void
}

export type LoginIDFieldState = Readonly<{ type: "succeed-to-update"; result: Valid<LoginIDValidationError> }>

export const initialLoginIDFieldState: LoginIDFieldState = {
    type: "succeed-to-update",
    result: noError(),
}

interface Handler<T> {
    (state: T): void
}
