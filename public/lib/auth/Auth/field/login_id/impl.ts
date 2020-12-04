import { LoginIDFieldActionSet, LoginIDFieldComponent, LoginIDFieldState } from "./component"

import { LoginIDFieldEvent } from "../../../common/login_id/field/data"
import { InputValue } from "../../../common/field/data"

export function initLoginIDField(actions: LoginIDFieldActionSet): LoginIDFieldComponent {
    return new Component(actions)
}

class Component implements LoginIDFieldComponent {
    actions: LoginIDFieldActionSet

    listener: Post<LoginIDFieldState>[] = []

    constructor(actions: LoginIDFieldActionSet) {
        this.actions = actions
    }

    onStateChange(post: Post<LoginIDFieldState>): void {
        this.listener.push(post)
    }
    post(state: LoginIDFieldState): void {
        this.listener.forEach((post) => post(state))
    }

    set(inputValue: InputValue): void {
        this.actions.loginID.set(inputValue, (event) => {
            this.post(this.mapLoginIDFieldEvent(event))
        })
    }
    validate(post: Post<LoginIDFieldEvent>): void {
        this.actions.loginID.validate((event) => {
            this.post(this.mapLoginIDFieldEvent(event))
            post(event)
        })
    }

    mapLoginIDFieldEvent(event: LoginIDFieldEvent): LoginIDFieldState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
