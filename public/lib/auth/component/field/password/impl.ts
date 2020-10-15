import {
    PasswordFieldActionSet,
    PasswordFieldComponent,
    PasswordFieldState,
    PasswordFieldRequest,
} from "./component"

import { PasswordFieldAction } from "../../../../password/field/action"

import { PasswordFieldEvent } from "../../../../password/field/data"

type Background = Readonly<{
    password: PasswordFieldAction
}>

export function initPasswordField(actions: PasswordFieldActionSet): PasswordFieldComponent {
    return new Component(actions)
}

class Component implements PasswordFieldComponent {
    background: Background

    listener: Post<PasswordFieldState>[] = []

    constructor(actions: PasswordFieldActionSet) {
        this.background = {
            password: actions.password.action,
        }
        this.setup(actions)
    }
    setup(actions: PasswordFieldActionSet): void {
        actions.password.subscriber.onPasswordFieldEvent(event => this.post(this.mapPasswordFieldEvent(event)))
    }
    mapPasswordFieldEvent(event: PasswordFieldEvent): PasswordFieldState {
        return event
    }

    onStateChange(post: Post<PasswordFieldState>): void {
        this.listener.push(post)
    }
    post(state: PasswordFieldState): void {
        this.listener.forEach(post => post(state))
    }

    action(request: PasswordFieldRequest): void {
        switch (request.type) {
            case "set":
                this.background.password.set(request.inputValue)
                return

            case "show":
                this.background.password.show()
                return

            case "hide":
                this.background.password.hide()
                return

            default:
                assertNever(request)
        }
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
