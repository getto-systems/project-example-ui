import {
    FormFieldComponent,
    FormFieldEmptyState,
    FormFieldHandler,
    FormFieldComponentState,
    FormInputComponent,
} from "../../../../../common/vendor/getto-form/x_Resource/Form/component"

import { LoginIDFormField } from "../../../field/loginID/action"

import { LoginIDValidationError } from "../../../field/loginID/data"

export interface LoginIDFormFieldComponentFactory {
    (material: LoginIDFormFieldMaterial): { (handler: FormFieldHandler): LoginIDFormFieldComponent }
}
export type LoginIDFormFieldMaterial = Readonly<{
    // TODO field という名前にしたい
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
