import { packInputValue } from "../../../field/adapter"

import { InputValue } from "../../../field/data"

export function mapInputEvent(post: Post<InputValue>): Post<InputEvent> {
    return (e: InputEvent): void => {
        if (e.target instanceof HTMLInputElement) {
            post(packInputValue(e.target.value))
        }
    }
}

interface Post<T> {
    (state: T): void
}
