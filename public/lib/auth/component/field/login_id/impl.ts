import {
    LoginIDFieldActionSet,
    LoginIDFieldComponent,
    LoginIDFieldState,
    LoginIDFieldRequest,
} from "./component"

import { LoginIDFieldEvent } from "../../../../login_id/field/data"

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

    action(request: LoginIDFieldRequest): void {
        switch (request.type) {
            case "set":
                this.actions.loginID.set(request.inputValue, (event) => {
                    this.post(this.mapLoginIDFieldEvent(event))
                })
                return
        }
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
