import { LoginIDField } from "../../../field/login_id/action"

import { LoginIDFieldError } from "../../../field/login_id/data"
import { LoginID } from "../../../login_id/data"
import { Valid, Content } from "../../../field/data"

export interface LoginIDFieldComponent {
    onContentChange(contentChanged: Publisher<Content<LoginID>>): void
    init(stateChanged: Publisher<LoginIDFieldComponentState>): void
    terminate(): void

    field: LoginIDField
}

export type LoginIDFieldComponentState =
    Readonly<{ type: "succeed-to-update-login_id", result: Valid<LoginIDFieldError> }>

export const initialLoginIDFieldComponentState: LoginIDFieldComponentState = {
    type: "succeed-to-update-login_id",
    result: { valid: true },
}

interface Publisher<T> {
    (state: T): void
}
