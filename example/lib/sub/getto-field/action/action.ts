import { FieldChangeEvent, FieldInputEvent } from "./event"

import { FieldInputString } from "../data"
import { FieldHistory } from "./data"

export interface FieldInput {
    get(): FieldInputString
    input(value: FieldInputString, post: Post<FieldInputEvent>): void
    change(post: Post<FieldChangeEvent>): void
    restore(history: FieldHistory, post: Post<FieldInputEvent>): void
}

interface Post<E> {
    (event: E): void
}
