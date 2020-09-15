import { LoginIDField } from "../../../field/login_id/action"

import { LoginIDFieldError } from "../../../field/login_id/data"
import { LoginID } from "../../../credential/data"
import { Valid, Content } from "../../../input/data"

export interface LoginIDFieldComponent {
    onContentChange(contentChanged: Publisher<Content<LoginID>>): void
    init(stateChanged: Publisher<LoginIDFieldComponentState>): void
    terminate(): void

    field: LoginIDField
}

export type LoginIDFieldComponentState =
    Readonly<{ type: "input-login-id", result: Valid<LoginIDFieldError> }>

export const initialLoginIDFieldComponentState: LoginIDFieldComponentState = { type: "input-login-id", result: { valid: true } }

interface Publisher<T> {
    (state: T): void
}
