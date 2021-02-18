import { BoardValidateResult } from "./data"

export type ValidateBoardEvent<E> = Readonly<{
    type: "succeed-to-validate"
    result: BoardValidateResult<E>
}>
