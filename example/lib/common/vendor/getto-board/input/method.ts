import { InputBoardEvent } from "./event"

import { BoardValue } from "../kernel/data"

export interface SetBoardValueMethod {
    (value: BoardValue, post: Post<InputBoardEvent>): void
}
export interface ClearBoardMethod {
    (post: Post<InputBoardEvent>): void
}

interface Post<E> {
    (event: E): void
}
