import { FormComponent, FormMaterial } from "../../../../../sub/getto-form/x_components/Form/component"
import { LoginIDFormFieldComponent, LoginIDFormFieldMaterial } from "../../../common/Field/LoginID/component"
import { PasswordFormFieldComponent, PasswordFormFieldMaterial } from "../../../common/Field/Password/component"

import { FormConvertResult } from "../../../../../sub/getto-form/form/data"
import { LoginFields } from "../../../../login/passwordLogin/data"

export interface PasswordLoginFormComponentFactory {
    (material: PasswordLoginFormMaterial): PasswordLoginFormComponent
}
export type PasswordLoginFormMaterial = FormMaterial &
    LoginIDFormFieldMaterial &
    PasswordFormFieldMaterial

export interface PasswordLoginFormComponent extends FormComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent
    getLoginFields(): FormConvertResult<LoginFields>
}
