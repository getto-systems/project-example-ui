import { ApplicationComponent } from "../../../../sub/getto-example/x_components/Application/component"

import { RenewCredentialComponent } from "../renewCredential/component"

import { PasswordLoginComponent, PasswordLoginFormComponent } from "../passwordLogin/component"
import {
    PasswordResetSessionComponent,
    PasswordResetSessionFormComponent,
} from "../passwordResetSession/component"
import { PasswordResetComponent, PasswordResetFormComponent } from "../passwordReset/component"

export type LoginEntryPoint = Readonly<{
    view: LoginView
    terminate: Terminate
}>

export interface LoginView extends ApplicationComponent<LoginState> {
    load(): void
}

export type LoginState =
    | Readonly<{ type: "initial-view" }>
    | Readonly<{ type: "renew-credential"; resource: RenewCredentialResource }>
    | Readonly<{ type: "password-login"; resource: PasswordLoginResource }>
    | Readonly<{ type: "password-reset-session"; resource: PasswordResetSessionResource }>
    | Readonly<{ type: "password-reset"; resource: PasswordResetResource }>
    | Readonly<{ type: "error"; err: string }>

export type ViewState = "password-login" | "password-reset-session" | "password-reset"

export const initialLoginState: LoginState = { type: "initial-view" }

export type RenewCredentialResource = Readonly<{
    renewCredential: RenewCredentialComponent
}>
export type PasswordLoginResource = Readonly<{
    passwordLogin: PasswordLoginComponent
    form: PasswordLoginFormComponent
}>
export type PasswordResetSessionResource = Readonly<{
    passwordResetSession: PasswordResetSessionComponent
    form: PasswordResetSessionFormComponent
}>
export type PasswordResetResource = Readonly<{
    passwordReset: PasswordResetComponent
    form: PasswordResetFormComponent
}>

interface Terminate {
    (): void
}
