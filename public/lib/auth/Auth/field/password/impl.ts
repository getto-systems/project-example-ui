import { PasswordFieldActionSet, PasswordFieldComponent, PasswordFieldState } from "./component"

import { PasswordFieldEvent } from "../../../common/field/password/data"
import { InputValue } from "../../../common/field/data"

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

    set(inputValue: InputValue): void {
        this.actions.password.set(inputValue, (event) => {
            this.post(this.mapPasswordFieldEvent(event))
        })
    }
    show(): void {
        this.actions.password.show((event) => {
            this.post(this.mapPasswordFieldEvent(event))
        })
    }
    hide(): void {
        this.actions.password.hide((event) => {
            this.post(this.mapPasswordFieldEvent(event))
        })
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
