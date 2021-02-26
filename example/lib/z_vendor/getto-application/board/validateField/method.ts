import { BoardFieldConvertResult } from "./data"

export interface ConvertBoardFieldMethod<T, E> {
    (): BoardFieldConvertResult<T, E>
}
