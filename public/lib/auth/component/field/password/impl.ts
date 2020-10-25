import {
    PasswordFieldActionSet,
    PasswordFieldComponent,
    PasswordFieldState,
    PasswordFieldRequest,
} from "./component"

import { PasswordFieldEvent } from "../../../../password/field/data"

export function initPasswordField(background: PasswordFieldActionSet): PasswordFieldComponent {
    return new Component(background)
}

class Component implements PasswordFieldComponent {
    background: PasswordFieldActionSet

    listener: Post<PasswordFieldState>[] = []

    constructor(background: PasswordFieldActionSet) {
        this.background = background
    }

    onStateChange(post: Post<PasswordFieldState>): void {
        this.listener.push(post)
    }
    post(state: PasswordFieldState): void {
        this.listener.forEach((post) => post(state))
    }

    action(request: PasswordFieldRequest): void {
        switch (request.type) {
            case "set":
                this.background.password.set(request.inputValue, (event) => {
                    this.post(this.mapPasswordFieldEvent(event))
                })
                return

            case "show":
                this.background.password.show((event) => {
                    this.post(this.mapPasswordFieldEvent(event))
                })
                return

            case "hide":
                this.background.password.hide((event) => {
                    this.post(this.mapPasswordFieldEvent(event))
                })
                return

            default:
                assertNever(request)
        }
    }
    validate(post: Post<PasswordFieldEvent>): void {
        this.background.password.validate((event) => {
            this.post(this.mapPasswordFieldEvent(event))
            post(event)
        })
    }

    mapPasswordFieldEvent(event: PasswordFieldEvent): PasswordFieldState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
