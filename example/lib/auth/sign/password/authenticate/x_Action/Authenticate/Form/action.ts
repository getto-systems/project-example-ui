import { ApplicationAction } from "../../../../../../../z_vendor/getto-application/action/action"
import { ValidateBoardAction } from "../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { InputLoginIDAction } from "../../../../../common/fields/loginID/board/Action/Core/action"
import { InputPasswordAction } from "../../../../../common/fields/password/board/Action/Core/action"

import { AuthenticateFields } from "../../../data"

export interface FormAction extends ApplicationAction {
    readonly loginID: InputLoginIDAction
    readonly password: InputPasswordAction
    readonly validate: ValidateAuthenticateAction
    readonly clear: ClearAction
}

export enum AuthenticatePasswordFieldsEnum {
    "loginID" = "loginID",
    "password" = "password",
}
type Fields = keyof typeof AuthenticatePasswordFieldsEnum

export type ValidateAuthenticateAction = ValidateBoardAction<Fields, AuthenticateFields>

interface ClearAction {
    (): void
}
