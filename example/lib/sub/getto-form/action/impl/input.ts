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
        this.pushHistory()
    }

    pushHistory(): FormHistory {
        const history = {
            previous: this.previous,
            current: this.current,
        }
        this.previous = { type: "hasPrevious", history }
        return history
    }

    get(): FormInputString {
        return this.current
    }
    input(value: FormInputString, post: Post<FormInputEvent>): void {
        this.current = value
        post({ value })
    }
    change(post: Post<FormChangeEvent>): void {
        if (this.isChanged()) {
            post({ history: this.pushHistory() })
        }
    }
    isChanged(): boolean {
        switch (this.previous.type) {
            case "first":
                return true

            case "hasPrevious":
                return this.previous.history.current !== this.current
        }
    }
    restore(history: FormHistory, post: Post<FormInputEvent>): void {
        this.previous = history.previous
        this.current = history.current
        post({ value: this.current })

        if (this.previous.type === "first") {
            this.pushHistory()
        }
    }
}

interface Post<E> {
    (event: E): void
}
