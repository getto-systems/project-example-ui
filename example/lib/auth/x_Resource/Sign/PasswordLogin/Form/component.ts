import {
    FormContainerComponent,
    FormContainerMaterial,
} from "../../../../../common/getto-form/x_Resource/Form/component"
import {
    LoginIDFormFieldComponent,
    LoginIDFormFieldMaterial,
} from "../../../common/Field/LoginID/component"
import {
    PasswordFormFieldComponent,
    PasswordFormFieldMaterial,
} from "../../../common/Field/Password/component"

import { FormConvertResult } from "../../../../../common/getto-form/form/data"
import { LoginFields } from "../../../../sign/passwordLogin/data"

export interface FormComponentFactory {
    (material: FormMaterial): FormComponent
}
export type FormMaterial = FormContainerMaterial & LoginIDFormFieldMaterial & PasswordFormFieldMaterial

export interface FormComponent extends FormContainerComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent
    getLoginFields(): FormConvertResult<LoginFields>
}
