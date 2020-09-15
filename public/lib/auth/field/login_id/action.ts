import { LoginIDFieldAction, LoginIDFieldEventHandler, LoginIDFieldEventPublisher } from "../../../field/login_id/action"

import { LoginIDFieldComponentState } from "./data"

import { LoginID } from "../../../credential/data"
import { InputValue, Content } from "../../../input/data"

export interface LoginIDFieldComponentAction {
    loginIDField: LoginIDFieldAction
}

export interface LoginIDFieldComponent {
    onContentChange(contentChanged: Publisher<Content<LoginID>>): void
    init(stateChanged: Publisher<LoginIDFieldComponentState>): void

    set(loginID: InputValue): Promise<void>
    validate(): Promise<void>
}

export interface LoginIDFieldComponentDeprecated {
    initialState: LoginIDFieldComponentState

    onChange(changed: LoginIDContentHandler): void

    set(event: LoginIDFieldComponentEventPublisher, loginID: InputValue): Promise<void>
    validate(event: LoginIDFieldComponentEventPublisher): Promise<void>
}

export interface LoginIDFieldComponentEventHandler extends LoginIDFieldEventHandler {
    onContentChange(contentChanged: LoginIDContentHandler): void
    onStateChange(stateChanged: LoginIDFieldComponentStateHandler): void
}

export interface LoginIDFieldComponentEventPublisher extends LoginIDFieldEventPublisher { } // eslint-disable-line @typescript-eslint/no-empty-interface

export interface LoginIDFieldComponentEventInit {
    (stateChanged: LoginIDFieldComponentStateHandler): LoginIDFieldComponentEventPublisher
}

// TODO あとで消す
export interface LoginIDFieldComponentStateHandler {
    (state: LoginIDFieldComponentState): void
}

// TODO あとで消す
export interface LoginIDContentHandler {
    (content: Content<LoginID>): void
}

interface Publisher<T> {
    (state: T): void
}
