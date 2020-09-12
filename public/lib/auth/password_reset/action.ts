import { LoginIDFieldComponent, LoginIDFieldComponentEventInit } from "../field/login_id/action"
import { PasswordFieldComponent, PasswordFieldComponentEventInit } from "../field/password/action"

import { CredentialAction, StoreEvent } from "../../credential/action"
import { PasswordResetAction, ResetEvent } from "../../password_reset/action"

import { StoreError } from "../../credential/data"
import { InputContent, ResetError } from "../../password_reset/data"

export interface PasswordResetComponentAction {
    credential: CredentialAction
    passwordReset: PasswordResetAction
}

export interface PasswordResetComponent {
    loginID: [LoginIDFieldComponent, LoginIDFieldComponentEventInit]
    password: [PasswordFieldComponent, PasswordFieldComponentEventInit]

    initialState: PasswordResetComponentState

    reset(event: PasswordResetComponentEvent): Promise<void>
}

export type PasswordResetComponentState =
    Readonly<{ type: "initial-reset" }> |
    Readonly<{ type: "try-to-reset" }> |
    Readonly<{ type: "delayed-to-reset" }> |
    Readonly<{ type: "failed-to-reset", content: InputContent, err: ResetError }> |
    Readonly<{ type: "failed-to-store", err: StoreError }>

export interface PasswordResetComponentEvent extends ResetEvent, StoreEvent { }

export interface PasswordResetComponentEventInit {
    (stateChanged: PasswordResetComponentStateHandler): PasswordResetComponentEvent
}

export interface PasswordResetComponentStateHandler {
    (state: PasswordResetComponentState): void
}
