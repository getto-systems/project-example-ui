import { AppHref } from "../href"

import { StoreCredentialOperation, StoreCredentialOperationSubscriber } from "../background/store_credential/component"

import { RenewCredentialComponent, RenewCredentialParam } from "./component/renew_credential/component"
import { ApplicationComponent, ApplicationParam } from "./component/application/component"

import { PasswordLoginComponent } from "./component/password_login/component"
import { PasswordResetSessionComponent } from "./component/password_reset_session/component"
import { PasswordResetComponent, PasswordResetParam } from "./component/password_reset/component"

import { RenewCredentialParamPacker } from "./component/renew_credential/component"
import { ApplicationParamPacker } from "./component/application/component"
import { PasswordResetParamPacker } from "./component/password_reset/component"

export interface AuthUsecase {
    href: AppHref
    component: AuthComponent
    onStateChange(stateChanged: Post<AuthState>): void
    init(): Terminate
}

export type AuthParam = Readonly<{
    renewCredential: RenewCredentialParamPacker
    application: ApplicationParamPacker

    passwordReset: PasswordResetParamPacker
}>

export type AuthBackground = Readonly<{
    storeCredential: Post<StoreCredentialOperation>
}>
export type AuthBackgroundSubscriber = Readonly<{
    storeCredential: StoreCredentialOperationSubscriber
}>

export type AuthComponent = Readonly<{
    renewCredential: RenewCredentialComponent
    application: ApplicationComponent

    passwordLogin: PasswordLoginComponent
    passwordResetSession: PasswordResetSessionComponent
    passwordReset: PasswordResetComponent
}>

export type AuthState =
    Readonly<{ type: "initial" }> |
    Readonly<{ type: "renew-credential", param: RenewCredentialParam }> |
    Readonly<{ type: "application", param: ApplicationParam }> |
    Readonly<{ type: "password-login" }> |
    Readonly<{ type: "password-reset-session" }> |
    Readonly<{ type: "password-reset", param: PasswordResetParam }> |
    Readonly<{ type: "error", err: string }>

export const initialAuthState: AuthState = { type: "initial" }

interface Post<T> {
    (state: T): void
}

interface Terminate {
    (): void
}
