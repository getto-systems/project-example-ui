import {
    FormContainerComponent,
    FormContainerMaterial,
} from "../../../../../../common/vendor/getto-form/x_Resource/Form/component"
import {
    LoginIDFormFieldComponent,
    LoginIDFormFieldMaterial,
} from "../../../../../common/x_Component/Field/LoginID/component"
import {
    PasswordFormFieldComponent,
    PasswordFormFieldMaterial,
} from "../../../../../common/x_Component/Field/Password/component"

import { FormConvertResult } from "../../../../../../common/vendor/getto-form/form/data"
import { PasswordLoginFields } from "../../../../password/authenticate/data"

export interface PasswordLoginFormComponent extends FormContainerComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent
    getLoginFields(): FormConvertResult<PasswordLoginFields>
}

export type PasswordLoginFormMaterial = FormContainerMaterial &
    LoginIDFormFieldMaterial &
    PasswordFormFieldMaterial
