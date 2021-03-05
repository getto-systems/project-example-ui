import { ApplicationAction } from "../../../../../../../z_vendor/getto-application/action/action"
import { InputLoginIDAction } from "../../../../../common/fields/loginID/input/Action/Core/action"
import { InputPasswordAction } from "../../../../../common/fields/password/input/Action/Core/action"
import { ValidateBoardAction } from "../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"

import { ResetPasswordFields } from "../../data"

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
