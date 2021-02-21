import {
    FormContainerComponent,
    FormContainerMaterial,
} from "../../../../../../../../z_getto/getto-form/x_Resource/Form/component"
import {
    LoginIDFormFieldComponent,
    LoginIDFormFieldMaterial,
} from "../../../../../../../common/x_Component/Field/LoginID/component"

import { PasswordResetSessionFields } from "../../../data"
import { FormConvertResult } from "../../../../../../../../z_getto/getto-form/form/data"

export interface StartPasswordResetSessionFormAction extends FormContainerComponent {
    readonly loginID: LoginIDFormFieldComponent
    getStartSessionFields(): FormConvertResult<PasswordResetSessionFields>
}

export type StartPasswordResetSessionFormMaterial = FormContainerMaterial & LoginIDFormFieldMaterial
