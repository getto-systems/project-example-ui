import {
    FormContainerComponent,
    FormContainerMaterial,
} from "../../../../../common/getto-form/x_Resource/Form/component"
import {
    LoginIDFormFieldComponent,
    LoginIDFormFieldMaterial,
} from "../../../common/Field/LoginID/component"

import { StartSessionFields } from "../../../../sign/password/reset/register/data"
import { FormConvertResult } from "../../../../../common/getto-form/form/data"

export interface FormComponentFactory {
    (material: FormMaterial): FormComponent
}
export type FormMaterial = FormContainerMaterial & LoginIDFormFieldMaterial

export interface FormComponent extends FormContainerComponent {
    readonly loginID: LoginIDFormFieldComponent
    getStartSessionFields(): FormConvertResult<StartSessionFields>
}
