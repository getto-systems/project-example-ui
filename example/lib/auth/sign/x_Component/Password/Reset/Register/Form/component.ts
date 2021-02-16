import {
    FormContainerComponent,
    FormContainerMaterial,
} from "../../../../../../../vendor/getto-form/x_Resource/Form/component"
import {
    LoginIDFormFieldComponent,
    LoginIDFormFieldMaterial,
} from "../../../../../../common/x_Component/Field/LoginID/component"
import {
    PasswordFormFieldComponent,
    PasswordFormFieldMaterial,
} from "../../../../../../common/x_Component/Field/Password/component"

import { PasswordResetFields } from "../../../../../password/reset/register/data"
import { FormConvertResult } from "../../../../../../../vendor/getto-form/form/data"

export interface PasswordResetRegisterFormComponent extends FormContainerComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent
    getResetFields(): FormConvertResult<PasswordResetFields>
}

export type PasswordResetRegisterFormMaterial = FormContainerMaterial &
    LoginIDFormFieldMaterial &
    PasswordFormFieldMaterial
