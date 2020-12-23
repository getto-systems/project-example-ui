import { InputValue, markInputValue } from "../../../../auth/common/field/data"

export function mapInputEvent(post: Post<InputValue>): Post<InputEvent> {
    return (e: InputEvent): void => {
        if (e.target instanceof HTMLInputElement) {
            post(markInputValue(e.target.value))
        }
    }
}

interface Post<T> {
    (state: T): void
}
