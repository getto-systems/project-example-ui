import {
    FormContainerComponent,
    FormContainerMaterial,
} from "../../../../../vendor/getto-form/x_Resource/Form/component"
import {
    LoginIDFormFieldComponent,
    LoginIDFormFieldMaterial,
} from "../../../common/Field/LoginID/component"

import { PasswordResetSessionFields } from "../../../../sign/password/reset/session/data"
import { FormConvertResult } from "../../../../../vendor/getto-form/form/data"

export interface FormComponentFactory {
    (material: FormMaterial): FormComponent
}
export type FormMaterial = FormContainerMaterial & LoginIDFormFieldMaterial

export interface FormComponent extends FormContainerComponent {
    readonly loginID: LoginIDFormFieldComponent
    getStartSessionFields(): FormConvertResult<PasswordResetSessionFields>
}
