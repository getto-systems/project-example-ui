import { ApplicationAction } from "../../../../../../../../z_vendor/getto-application/action/action"
import { ValidateBoardAction } from "../../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { InputLoginIDAction } from "../../../../../../common/fields/loginID/input/Action/Core/action"

import { RequestTokenFields } from "../../../data"

export interface FormAction extends ApplicationAction {
    readonly loginID: InputLoginIDAction
    readonly validate: ValidateRequestTokenAction
    readonly clear: ClearAction
}

export enum RequestPasswordResetTokenFieldsEnum {
    "loginID" = "loginID",
}
type Fields = keyof typeof RequestPasswordResetTokenFieldsEnum

export type ValidateRequestTokenAction = ValidateBoardAction<Fields, RequestTokenFields>

interface ClearAction {
    (): void
}
