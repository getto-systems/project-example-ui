import { BoardConvertResult } from "../kernel/data"
import { BoardFieldValidateResult } from "./data"

export interface ConvertBoardFieldMethod<T> {
    (): BoardConvertResult<T>
}

export interface ValidateBoardFieldMethod<E> {
    (): BoardFieldValidateResult<E>
}
