import { ApplicationAction } from "../../../../z_vendor/getto-application/action/action"
import { ValidateBoardAction } from "../../../../z_vendor/getto-application/board/action_validate_board/core/action"
import { InputLoginIDAction } from "../../../login_id/action_input/core/action"
import { InputPasswordAction } from "../../action_input/core/action"

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
