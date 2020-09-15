import { LoginIDField, LoginIDFieldAction, LoginIDFieldEventHandler } from "../../../field/login_id/action"

import { LoginIDFieldComponentState } from "./data"

import { LoginID } from "../../../credential/data"
import { Content } from "../../../input/data"

export interface LoginIDFieldComponentAction {
    loginIDField: LoginIDFieldAction
}

export interface LoginIDFieldComponent {
    onContentChange(contentChanged: Publisher<Content<LoginID>>): void
    init(stateChanged: Publisher<LoginIDFieldComponentState>): void

    field: LoginIDField
}

export interface LoginIDFieldComponentEventHandler extends LoginIDFieldEventHandler {
    onContentChange(contentChanged: Publisher<Content<LoginID>>): void
    onStateChange(stateChanged: Publisher<LoginIDFieldComponentState>): void
}

interface Publisher<T> {
    (state: T): void
}
