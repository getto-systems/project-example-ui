import { LoginIDField, LoginIDFieldAction } from "../../../field/login_id/action"

import { LoginIDFieldComponentState } from "./data"

import { LoginID } from "../../../credential/data"
import { Content } from "../../../input/data"

export interface LoginIDFieldComponentAction {
    loginIDField: LoginIDFieldAction
}

export interface LoginIDFieldComponent {
    onContentChange(contentChanged: Publisher<Content<LoginID>>): void
    init(stateChanged: Publisher<LoginIDFieldComponentState>): void
    terminate(): void

    field: LoginIDField
}

interface Publisher<T> {
    (state: T): void
}
