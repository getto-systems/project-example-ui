import { ConvertBoardFieldResult } from "./data"

export interface ConvertBoardFieldMethod<T, E> {
    (): ConvertBoardFieldResult<T, E>
}
