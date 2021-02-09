import {
    FormFieldComponent,
    FormFieldHandler,
    FormFieldComponentState,
    FormInputComponent,
} from "../../../../sub/getto-form/component/component"

import {
    PasswordCharacterChecker,
    PasswordFormField,
    PasswordViewer,
} from "../../../common/field/password/action"

import {
    PasswordValidationError,
    PasswordCharacter,
    PasswordView,
} from "../../../common/field/password/data"

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
