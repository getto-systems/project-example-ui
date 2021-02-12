import { FormContainerComponent, FormContainerMaterial } from "../../../../../sub/getto-form/x_Component/Form/component"
import { LoginIDFormFieldComponent, LoginIDFormFieldMaterial } from "../../../common/Field/LoginID/component"

import { StartSessionFields } from "../../../../profile/passwordReset/data"
import { FormConvertResult } from "../../../../../sub/getto-form/form/data"

export interface PasswordResetSessionFormComponentFactory {
    (material: PasswordResetSessionFormMaterial): PasswordResetSessionFormComponent
}
export type PasswordResetSessionFormMaterial = FormContainerMaterial & LoginIDFormFieldMaterial

export interface PasswordResetSessionFormComponent extends FormContainerComponent {
    readonly loginID: LoginIDFormFieldComponent
    getStartSessionFields(): FormConvertResult<StartSessionFields>
}
