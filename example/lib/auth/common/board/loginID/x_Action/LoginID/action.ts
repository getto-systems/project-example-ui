import { InputBoardValueAction } from "../../../../../../common/vendor/getto-board/input/x_Action/Input/action"
import {
    ValidateBoardFieldAction,
    ValidateBoardFieldState,
} from "../../../../../../common/vendor/getto-board/validateField/x_Action/ValidateField/action"

import { LoginID } from "../../../../loginID/data"
import { ValidateLoginIDError } from "./data"

export type LoginIDBoardResource = Readonly<{
    input: InputBoardValueAction
    validate: ValidateLoginIDAction
}>

export type ValidateLoginIDAction = ValidateBoardFieldAction<LoginID, ValidateLoginIDError>
export type ValidateLoginIDState = ValidateBoardFieldState<ValidateLoginIDError>
