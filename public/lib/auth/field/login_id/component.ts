import { LoginIDField } from "../../../field/login_id/action"

import { LoginIDFieldAction } from "../../../field/login_id/action"

import { LoginIDFieldComponentState } from "./data"

import { LoginID } from "../../../login_id/data"
import { Content } from "../../../field/data"

export interface LoginIDFieldComponent {
    onContentChange(contentChanged: Publisher<Content<LoginID>>): void
    init(stateChanged: Publisher<LoginIDFieldComponentState>): void
    terminate(): void

    field: LoginIDField
}

export interface LoginIDFieldComponentAction {
    loginIDField: LoginIDFieldAction
}

interface Publisher<T> {
    (state: T): void
}
