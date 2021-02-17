import {
    FormContainerComponent,
    FormContainerMaterial,
} from "../../../../../../../common/vendor/getto-form/x_Resource/Form/component"
import {
    LoginIDFormFieldComponent,
    LoginIDFormFieldMaterial,
} from "../../../../../../common/x_Component/Field/LoginID/component"

import { PasswordResetSessionFields } from "../../../../../password/resetSession/start/data"
import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"

export interface StartPasswordResetSessionFormAction extends FormContainerComponent {
    readonly loginID: LoginIDFormFieldComponent
    getStartSessionFields(): FormConvertResult<PasswordResetSessionFields>
}

export type StartPasswordResetSessionFormMaterial = FormContainerMaterial & LoginIDFormFieldMaterial
