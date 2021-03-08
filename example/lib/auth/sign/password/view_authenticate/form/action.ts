import { ApplicationAction } from "../../../../../z_vendor/getto-application/action/action"
import { ValidateBoardAction } from "../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { InputLoginIDAction } from "../../../common/fields/login_id/action/core/action"
import { InputPasswordAction } from "../../../common/fields/password/action/core/action"

import { AuthenticatePasswordFields } from "../../authenticate/data"

export interface AuthenticatePasswordFormAction extends ApplicationAction {
    readonly loginID: InputLoginIDAction
    readonly password: InputPasswordAction
    readonly validate: ValidateAuthenticatePasswordFieldsAction
    readonly clear: ClearAction
}

export enum AuthenticatePasswordFieldsEnum {
    "loginID" = "loginID",
    "password" = "password",
}
export type ValidateAuthenticatePasswordFieldsAction = ValidateBoardAction<
    keyof typeof AuthenticatePasswordFieldsEnum,
    AuthenticatePasswordFields
>

interface ClearAction {
    (): void
}
