import { ApplicationAction } from "../../../../../../../z_vendor/getto-application/action/action"
import { ValidateBoardAction } from "../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { InputLoginIDAction } from "../../../../../common/fields/loginID/input/Action/Core/action"

import { RequestResetTokenFields } from "../../data"

export interface RequestResetTokenFormAction extends ApplicationAction {
    readonly loginID: InputLoginIDAction
    readonly validate: ValidateRequestTokenAction
    readonly clear: ClearAction
}

export enum RequestResetTokenFieldsEnum {
    "loginID" = "loginID",
}
export type ValidateRequestTokenAction = ValidateBoardAction<
    keyof typeof RequestResetTokenFieldsEnum,
    RequestResetTokenFields
>

interface ClearAction {
    (): void
}
