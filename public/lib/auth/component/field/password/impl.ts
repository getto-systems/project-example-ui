import {
    PasswordFieldActionSet,
    PasswordFieldComponent,
    PasswordFieldState,
    PasswordFieldRequest,
} from "./component"

import { PasswordFieldEvent } from "../../../../password/field/data"

export function initPasswordField(actions: PasswordFieldActionSet): PasswordFieldComponent {
    return new Component(actions)
}

class Component implements PasswordFieldComponent {
    actions: PasswordFieldActionSet

    listener: Post<PasswordFieldState>[] = []

    constructor(actions: PasswordFieldActionSet) {
        this.actions = actions
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
                this.actions.password.set(request.inputValue, (event) => {
                    this.post(this.mapPasswordFieldEvent(event))
                })
                return

            case "show":
                this.actions.password.show((event) => {
                    this.post(this.mapPasswordFieldEvent(event))
                })
                return

            case "hide":
                this.actions.password.hide((event) => {
                    this.post(this.mapPasswordFieldEvent(event))
                })
                return

            default:
                assertNever(request)
        }
    }
    validate(post: Post<PasswordFieldEvent>): void {
        this.actions.password.validate((event) => {
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
