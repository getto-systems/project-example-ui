import {
    FormContainerComponent,
    FormContainerMaterial,
} from "../../../../../sub/getto-form/x_Component/Form/component"
import {
    LoginIDFormFieldComponent,
    LoginIDFormFieldMaterial,
} from "../../../common/Field/LoginID/component"
import {
    PasswordFormFieldComponent,
    PasswordFormFieldMaterial,
} from "../../../common/Field/Password/component"

import { ResetFields } from "../../../../profile/passwordReset/data"
import { FormConvertResult } from "../../../../../sub/getto-form/form/data"

export interface FormComponentFactory {
    (material: FormMaterial): FormComponent
}
export type FormMaterial = FormContainerMaterial & LoginIDFormFieldMaterial & PasswordFormFieldMaterial

export interface FormComponent extends FormContainerComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent
    getResetFields(): FormConvertResult<ResetFields>
}
