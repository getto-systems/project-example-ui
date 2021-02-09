import {
    FormFieldComponent,
    FormFieldEmptyState,
    FormFieldHandler,
    FormFieldComponentState,
    FormInputComponent,
} from "../../../../sub/getto-form/component/component"

import { LoginIDFormField } from "../../../common/field/loginID/action"

import { LoginIDValidationError } from "../../../common/field/loginID/data"

export interface LoginIDFormFieldComponentFactory {
    (material: LoginIDFormFieldMaterial): { (handler: FormFieldHandler): LoginIDFormFieldComponent }
}
export type LoginIDFormFieldMaterial = Readonly<{
    loginID: LoginIDFormField
}>

export interface LoginIDFormFieldComponent
    extends FormFieldComponent<FormFieldEmptyState, LoginIDValidationError> {
    readonly input: FormInputComponent
}

export type LoginIDFormFieldComponentState = FormFieldComponentState<
    FormFieldEmptyState,
    LoginIDValidationError
>

interface Handler<T> {
    (state: T): void
}
