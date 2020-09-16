import { CredentialAction, StoreEventPublisher } from "../../credential/action"
import { PasswordResetAction, ResetEvent } from "../../password_reset/action"

import { LoginIDFieldComponent } from "../field/login_id/data"
import { PasswordFieldComponent } from "../field/password/data"

import { StoreError } from "../../credential/data"
import { InputContent, ResetError } from "../../password_reset/data"

export interface PasswordResetComponentAction {
    credential: CredentialAction
    passwordReset: PasswordResetAction
}

export interface PasswordResetComponent {
    loginID: LoginIDFieldComponent
    password: PasswordFieldComponent

    initialState: PasswordResetComponentState

    reset(event: PasswordResetComponentEvent): Promise<void>
}

export type PasswordResetComponentState =
    Readonly<{ type: "initial-reset" }> |
    Readonly<{ type: "try-to-reset" }> |
    Readonly<{ type: "delayed-to-reset" }> |
    Readonly<{ type: "failed-to-reset", content: InputContent, err: ResetError }> |
    Readonly<{ type: "failed-to-store", err: StoreError }>

export interface PasswordResetComponentEvent extends ResetEvent, StoreEventPublisher { }

export interface PasswordResetComponentEventInit {
    (stateChanged: PasswordResetComponentStateHandler): PasswordResetComponentEvent
}

export interface PasswordResetComponentStateHandler {
    (state: PasswordResetComponentState): void
}
