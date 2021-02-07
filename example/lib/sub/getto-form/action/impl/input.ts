import { FormInput } from "../action"

import { FormChangeEvent, FormInputEvent } from "../event"

import { FormInputString, markInputString } from "../../data"
import { FormHistory, FormHistoryPrevious } from "../data"

export function initFormInput(): FormInput {
    return new Input()
}

class Input implements FormInput {
    previous: FormHistoryPrevious
    current: FormInputString

    constructor() {
        this.previous = { type: "first" }
        this.current = markInputString("")
    }

    get(): FormInputString {
        return this.current
    }
    input(value: FormInputString, post: Post<FormInputEvent>): void {
        this.current = value
        post({ value })
    }
    change(post: Post<FormChangeEvent>): void {
        switch (this.previous.type) {
            case "first":
                this.pushHistory(post)
                break

            case "hasPrevious":
                if (this.previous.history.current !== this.current) {
                    this.pushHistory(post)
                }
                break

            default:
                assertNever(this.previous)
        }
    }
    pushHistory(post: Post<FormChangeEvent>): void {
        const history = {
            previous: this.previous,
            current: this.current,
        }
        post({ history })
        this.previous = { type: "hasPrevious", history }
    }
    restore(history: FormHistory, post: Post<FormInputEvent>): void {
        this.previous = history.previous
        this.current = history.current
        post({ value: this.current })
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}

interface Post<E> {
    (event: E): void
}
