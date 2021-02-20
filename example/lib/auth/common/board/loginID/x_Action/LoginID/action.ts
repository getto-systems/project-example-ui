import { InputBoardValueAction } from "../../../../../../z_getto/board/input/x_Action/Input/action"
import {
    ValidateBoardFieldAction,
    ValidateBoardFieldState,
} from "../../../../../../z_getto/board/validateField/x_Action/ValidateField/action"

import { LoginID } from "../../../../loginID/data"
import { ValidateLoginIDError } from "./data"

export type LoginIDBoardFieldResource = Readonly<{
    field: LoginIDBoardFieldAction
}>

export interface LoginIDBoardFieldAction {
    readonly input: InputBoardValueAction
    readonly validate: ValidateLoginIDAction
    readonly clear: ClearAction
}

export type ValidateLoginIDAction = ValidateBoardFieldAction<LoginID, ValidateLoginIDError>
export type ValidateLoginIDState = ValidateBoardFieldState<ValidateLoginIDError>

interface ClearAction {
    (): void
}
