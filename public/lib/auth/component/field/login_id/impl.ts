import {
    LoginIDFieldActionSet,
    LoginIDFieldComponent,
    LoginIDFieldState,
    LoginIDFieldRequest,
} from "./component"

import { LoginIDFieldEvent } from "../../../../login_id/field/data"

export function initLoginIDField(background: LoginIDFieldActionSet): LoginIDFieldComponent {
    return new Component(background)
}

class Component implements LoginIDFieldComponent {
    background: LoginIDFieldActionSet

    listener: Post<LoginIDFieldState>[] = []

    constructor(background: LoginIDFieldActionSet) {
        this.background = background
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
                this.background.loginID.set(request.inputValue, (event) => {
                    this.post(this.mapLoginIDFieldEvent(event))
                })
                return
        }
    }
    validate(post: Post<LoginIDFieldEvent>): void {
        this.background.loginID.validate((event) => {
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
