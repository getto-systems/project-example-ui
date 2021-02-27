import { ApplicationAction } from "../../../../../../../../z_vendor/getto-application/action/action"
import { InputLoginIDAction } from "../../../../../../common/board/loginID/Action/Core/action"
import { InputPasswordAction } from "../../../../../../common/board/password/Action/Core/action"
import { ValidateBoardAction } from "../../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"

import { ResetFields } from "../../../data"

export interface FormAction extends ApplicationAction {
    readonly loginID: InputLoginIDAction
    readonly password: InputPasswordAction
    readonly validate: ValidateResetAction
    readonly clear: ClearAction
}

export enum ResetPasswordFieldsEnum {
    "loginID" = "loginID",
    "password" = "password",
}
type Fields = keyof typeof ResetPasswordFieldsEnum

export type ValidateResetAction = ValidateBoardAction<Fields, ResetFields>

interface ClearAction {
    (): void
}
