import { FormInput } from "../action"

import { FormChangeEvent, FormInputEvent } from "../event"

import { emptyInputString, FormHistory, FormHistoryPrevious, FormInputString } from "../data"

export function initFormInput(): FormInput {
    return new Input()
}

class Input implements FormInput {
    previous: FormHistoryPrevious
    current: FormInputString

    constructor() {
        this.previous = { type: "first" }
        this.current = emptyInputString()
        this.pushHistory(() => {
            // まず初期値のスナップショットを取る
        })
    }

    pushHistory(hook: Hook): void {
        const history = {
            previous: this.previous,
            current: this.current,
        }
        this.previous = { type: "hasPrevious", history }
        hook(history)
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
            this.pushHistory((history) => {
                post({ history })
            })
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
    restore(target: FormHistory, post: Post<FormInputEvent>): void {
        this.previous = target.previous
        this.current = target.current
        this.pushHistory((history) => {
            // restore した値のスナップショットを取る
            post({ value: history.current })
        })
    }
}

interface Hook {
    (history: FormHistory): void
}
interface Post<E> {
    (event: E): void
}
