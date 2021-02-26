import { ConvertBoardResult } from "../kernel/data"
import { ValidateBoardState } from "./data"

export interface ConvertBoardMethod<T> {
    (): ConvertBoardResult<T>
}

export interface ValidateBoardMethod {
    (): ValidateBoardState
}
