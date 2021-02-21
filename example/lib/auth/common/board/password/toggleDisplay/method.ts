import { TogglePasswordDisplayBoardEvent } from "./event"

import { BoardValue } from "../../../../../z_getto/board/kernel/data"

export interface ShowPasswordDisplayBoardMethod {
    (password: BoardValue, post: Post<TogglePasswordDisplayBoardEvent>): void
}
export interface HidePasswordDisplayBoardMethod {
    (post: Post<TogglePasswordDisplayBoardEvent>): void
}

interface Post<E> {
    (event: E): void
}
