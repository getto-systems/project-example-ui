import {
    FormContainerComponent,
    FormContainerMaterial,
} from "../../../../../sub/getto-form/x_Component/Form/component"
import {
    LoginIDFormFieldComponent,
    LoginIDFormFieldMaterial,
} from "../../../common/Field/LoginID/component"

import { StartSessionFields } from "../../../../profile/passwordReset/data"
import { FormConvertResult } from "../../../../../sub/getto-form/form/data"

export interface FormComponentFactory {
    (material: FormMaterial): FormComponent
}
export type FormMaterial = FormContainerMaterial & LoginIDFormFieldMaterial

export interface FormComponent extends FormContainerComponent {
    readonly loginID: LoginIDFormFieldComponent
    getStartSessionFields(): FormConvertResult<StartSessionFields>
}
