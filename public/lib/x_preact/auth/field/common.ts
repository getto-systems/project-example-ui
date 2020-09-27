import { packInputValue, unpackInputValue } from "../../../field/adapter"

import { InputValue } from "../../../field/data"

export function mapInputValue(post: Post<string>): Post<InputValue> {
    return (inputValue: InputValue): void => {
        post(unpackInputValue(inputValue))
    }
}

export function onFieldInput(handleInput: Post<InputValue>): Post<InputEvent> {
    return (e: InputEvent): void => {
        if (e.target instanceof HTMLInputElement) {
            handleInput(packInputValue(e.target.value))
        }
    }
}

interface Post<T> {
    (state: T): void
}
