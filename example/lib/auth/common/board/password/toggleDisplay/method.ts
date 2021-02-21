import { TogglePasswordDisplayEvent } from "./event"

export interface ShowPasswordDisplayMethod {
    (post: Post<TogglePasswordDisplayEvent>): void
}
export interface HidePasswordDisplayMethod {
    (post: Post<TogglePasswordDisplayEvent>): void
}

interface Post<E> {
    (event: E): void
}
