import { InputBoardValueEvent } from "./event"

import { BoardValue } from "../kernel/data"

export interface SetBoardValueMethod {
    (value: BoardValue, post: Post<InputBoardValueEvent>): void
}
export interface ClearBoardValueMethod {
    (post: Post<InputBoardValueEvent>): void
}

interface Post<E> {
    (event: E): void
}
