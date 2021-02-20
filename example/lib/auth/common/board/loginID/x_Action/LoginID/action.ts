import { InputBoardValueAction } from "../../../../../../common/vendor/getto-board/input/x_Action/Input/action"
import {
    ValidateBoardFieldAction,
    ValidateBoardFieldState,
} from "../../../../../../common/vendor/getto-board/validateField/x_Action/ValidateField/action"

import { LoginID } from "../../../../loginID/data"
import { ValidateLoginIDError } from "./data"

export type LoginIDBoardFieldResource = Readonly<{
    field: LoginIDBoardFieldAction
}>

export type LoginIDBoardFieldAction = Readonly<{
    input: InputBoardValueAction
    validate: ValidateLoginIDAction
    clear: ClearAction
}>

export type ValidateLoginIDAction = ValidateBoardFieldAction<LoginID, ValidateLoginIDError>
export type ValidateLoginIDState = ValidateBoardFieldState<ValidateLoginIDError>

interface ClearAction {
    (): void
}
