import { ConvertBoardFieldResult } from "./data"

export type ValidateBoardFieldInfra<T, E> = Readonly<{
    converter: BoardFieldConverter<T, E>
}>

export interface BoardFieldConverter<T, E> {
    (): ConvertBoardFieldResult<T, E>
}
