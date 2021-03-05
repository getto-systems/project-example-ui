import { ApplicationAction } from "../../../../../../z_vendor/getto-application/action/action"
import { ValidateBoardAction } from "../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { InputLoginIDAction } from "../../../../common/fields/loginID/input/Action/Core/action"
import { InputPasswordAction } from "../../../../common/fields/password/input/Action/Core/action"

import { AuthenticatePasswordFields } from "../../data"

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
