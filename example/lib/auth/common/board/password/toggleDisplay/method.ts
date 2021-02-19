import { TogglePasswordDisplayBoardEvent } from "./event"

export interface ShowPasswordDisplayBoardMethod {
    (post: Post<TogglePasswordDisplayBoardEvent>): void
}
export interface HidePasswordDisplayBoardMethod {
    (post: Post<TogglePasswordDisplayBoardEvent>): void
}

interface Post<E> {
    (event: E): void
}
