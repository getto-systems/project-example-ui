import {
    LoginIDFieldActionSet,
    LoginIDFieldComponent,
    LoginIDFieldState,
    LoginIDFieldRequest,
} from "./component"

import { LoginIDFieldAction } from "../../../../login_id/field/action"

import { LoginIDFieldEvent } from "../../../../login_id/field/data"

type Background = Readonly<{
    loginID: LoginIDFieldAction
}>

export function initLoginIDFieldInit(actions: LoginIDFieldActionSet): LoginIDFieldComponent {
    return new Component(actions)
}

class Component implements LoginIDFieldComponent {
    background: Background

    listener: Post<LoginIDFieldState>[] = []

    constructor(actions: LoginIDFieldActionSet) {
        this.background = {
            loginID: actions.loginID.action,
        }
        this.setup(actions)
    }
    setup(actions: LoginIDFieldActionSet): void {
        actions.loginID.subscriber.onLoginIDFieldEvent(event => this.post(this.mapLoginIDFieldEvent(event)))
    }
    mapLoginIDFieldEvent(event: LoginIDFieldEvent): LoginIDFieldState {
        return event
    }

    onStateChange(post: Post<LoginIDFieldState>): void {
        this.listener.push(post)
    }
    post(state: LoginIDFieldState): void {
        this.listener.forEach(post => post(state))
    }

    action(request: LoginIDFieldRequest): void {
        switch (request.type) {
            case "set":
                this.background.loginID.set(request.inputValue)
                return
        }
    }
}

interface Post<T> {
    (state: T): void
}
