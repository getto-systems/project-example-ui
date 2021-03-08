import { ApplicationAction } from "../../../../../../z_vendor/getto-application/action/action"
import { InputLoginIDAction } from "../../../../common/fields/login_id/action/core/action"
import { InputPasswordAction } from "../../../../common/fields/password/action/core/action"
import { ValidateBoardAction } from "../../../../../../z_vendor/getto-application/board/action_validate_board/core/action"

import { ResetPasswordFields } from "../../reset/data"

export interface ResetPasswordFormAction extends ApplicationAction {
    readonly loginID: InputLoginIDAction
    readonly password: InputPasswordAction
    readonly validate: ValidateResetAction
    readonly clear: ClearAction
}

export enum ResetPasswordFieldsEnum {
    "loginID" = "loginID",
    "password" = "password",
}
export type ValidateResetAction = ValidateBoardAction<
    keyof typeof ResetPasswordFieldsEnum,
    ResetPasswordFields
>

interface ClearAction {
    (): void
}
