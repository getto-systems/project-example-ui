import { ApplicationAction } from "../../../../../z_vendor/getto-application/action/action"
import { ValidateBoardAction } from "../../../../../z_vendor/getto-application/board/action_validate_board/core/action"
import { InputLoginIDAction } from "../../../../login_id/action_input/core/action"

import { RequestResetTokenFields } from "../../request_token/data"

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
