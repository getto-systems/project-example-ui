import { LoginIDFieldComponent, LoginIDFieldState } from "./component"

import { noError, hasError } from "../../../common/field/data"

export function initLoginIDField(state: LoginIDFieldState): LoginIDFieldComponent {
    return new Component(state)
}

export class LoginIDFieldStateFactory {
    noError(): LoginIDFieldState {
        return { type: "succeed-to-update", result: noError() }
    }

    empty(): LoginIDFieldState {
        return { type: "succeed-to-update", result: hasError(["empty"]) }
    }
}

class Component implements LoginIDFieldComponent {
    state: LoginIDFieldState

    constructor(state: LoginIDFieldState) {
        this.state = state
    }

    onStateChange(post: Post<LoginIDFieldState>): void {
        post(this.state)
    }
    set(): void {
        // mock では特に何もしない
    }
    validate(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
