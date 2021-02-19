import { InputBoardAction } from "../../../../../../common/vendor/getto-board/input/x_Action/Input/action"
import {
    ValidateBoardAction,
    ValidateBoardState,
} from "../../../../../../common/vendor/getto-board/validate/x_Action/Validate/action"

import { LoginID } from "../../../../loginID/data"
import { ValidateLoginIDError } from "./data"

export type LoginIDBoardResource = Readonly<{
    validate: ValidateLoginIDAction
    input: InputBoardAction
}>

export type ValidateLoginIDAction = ValidateBoardAction<LoginID, ValidateLoginIDError>
export type ValidateLoginIDState = ValidateBoardState<ValidateLoginIDError>
