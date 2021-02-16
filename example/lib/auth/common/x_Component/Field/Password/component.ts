import {
    FormFieldComponent,
    FormFieldHandler,
    FormFieldComponentState,
    FormInputComponent,
} from "../../../../../common/vendor/getto-form/x_Resource/Form/component"

import {
    PasswordCharacterChecker,
    PasswordFormField,
    PasswordViewer,
} from "../../../field/password/action"

import {
    PasswordValidationError,
    PasswordCharacter,
    PasswordView,
} from "../../../field/password/data"

export interface PasswordFormFieldComponentFactory {
    (material: PasswordFormFieldMaterial): { (handler: FormFieldHandler): PasswordFormFieldComponent }
}
export type PasswordFormFieldMaterial = Readonly<{
    password: PasswordFormField
    character: PasswordCharacterChecker
    viewer: PasswordViewer
}>

export interface PasswordFormFieldComponent
    extends FormFieldComponent<PasswordState, PasswordValidationError> {
    readonly input: FormInputComponent
    show(): void
    hide(): void
}

export type PasswordFormFieldComponentState = FormFieldComponentState<
    PasswordState,
    PasswordValidationError
>

export type PasswordState = Readonly<{
    character: PasswordCharacter
    view: PasswordView
}>

export const initialPasswordFormFieldComponentState: PasswordFormFieldComponentState = {
    result: { valid: true },
    character: { complex: false },
    view: { show: false },
}
