import { InputValue, markInputValue } from "../../../../auth/common/field/data"

export function mapInputEvent(handler: Handler<InputValue>): Handler<InputEvent> {
    return (e: InputEvent): void => {
        if (e.target instanceof HTMLInputElement) {
            handler(markInputValue(e.target.value))
        }
    }
}

interface Handler<T> {
    (state: T): void
}
