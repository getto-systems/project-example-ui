import {
    FormContainerComponent,
    FormContainerMaterial,
} from "../../../../../../../common/vendor/getto-form/x_Resource/Form/component"
import {
    LoginIDFormFieldComponent,
    LoginIDFormFieldMaterial,
} from "../../../../../../common/x_Component/Field/LoginID/component"
import {
    PasswordFormFieldComponent,
    PasswordFormFieldMaterial,
} from "../../../../../../common/x_Component/Field/Password/component"

import { PasswordResetFields } from "../../../../../password/resetSession/register/data"
import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"

export interface RegisterPasswordFormAction extends FormContainerComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent
    getResetFields(): FormConvertResult<PasswordResetFields>
}

export type RegisterPasswordFormMaterial = FormContainerMaterial &
    LoginIDFormFieldMaterial &
    PasswordFormFieldMaterial
