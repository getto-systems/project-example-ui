import { BoardConvertResult } from "../kernel/data"
import { BoardValidateState } from "./data"

export interface ConvertBoardMethod<T> {
    (): BoardConvertResult<T>
}

export interface ValidateBoardMethod {
    (): BoardValidateState
}
