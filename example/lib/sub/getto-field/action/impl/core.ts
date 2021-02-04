import { FieldInput } from "../action"

import { FieldChangeEvent, FieldInputEvent } from "../event"

import { FieldInputString, markInputString } from "../../data"
import { FieldHistory } from "../data"

export function initFieldInput(): FieldInput {
    return new Input()
}

class Input implements FieldInput {
    previous: FieldInputString
    current: FieldInputString

    constructor() {
        this.previous = markInputString("")
        this.current = markInputString("")
    }

    get(): FieldInputString {
        return this.current
    }
    input(value: FieldInputString, post: Post<FieldInputEvent>): void {
        this.current = value
        post({ type: "succeed-to-input", value })
    }
    change(post: Post<FieldChangeEvent>): void {
        if (this.previous !== this.current) {
            post({ type: "succeed-to-change", history: this.history() })
            this.previous = this.current
        }
    }
    history(): FieldHistory {
        return {
            previous: this.previous,
            current: this.current,
        }
    }
    restore(history: FieldHistory, post: Post<FieldInputEvent>): void {
        this.previous = history.previous
        this.current = history.current
        post({ type: "succeed-to-input", value: this.current })
    }
}

interface Post<E> {
    (event: E): void
}
