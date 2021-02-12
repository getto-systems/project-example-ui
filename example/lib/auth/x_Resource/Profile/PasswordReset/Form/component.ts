import { FormComponent, FormMaterial } from "../../../../../sub/getto-form/x_components/Form/component"
import { LoginIDFormFieldComponent, LoginIDFormFieldMaterial } from "../../../Field/LoginID/component"
import { PasswordFormFieldComponent, PasswordFormFieldMaterial } from "../../../Field/Password/component"

import { ResetFields } from "../../../../profile/passwordReset/data"
import { FormConvertResult } from "../../../../../sub/getto-form/form/data"

export interface PasswordResetFormComponentFactory {
    (material: PasswordResetFormMaterial): PasswordResetFormComponent
}
export type PasswordResetFormMaterial = FormMaterial &
    LoginIDFormFieldMaterial &
    PasswordFormFieldMaterial

export interface PasswordResetFormComponent extends FormComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent
    getResetFields(): FormConvertResult<ResetFields>
}
