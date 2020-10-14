import {
    LoginIDFieldComponent,
    LoginIDFieldState,
} from "../../../../auth/component/field/login_id/component"

import { noError, hasError } from "../../../../field/data"

export function newLoginIDFieldComponent(state: LoginIDFieldState): LoginIDFieldComponent {
    return new Component(state)
}

export class LoginIDFieldInit {
    noError(): LoginIDFieldState {
        return { type: "succeed-to-update-login_id", result: noError() }
    }

    empty(): LoginIDFieldState {
        return { type: "succeed-to-update-login_id", result: hasError(["empty"]) }
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
    action(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
