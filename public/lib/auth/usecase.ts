import { AppHref } from "../href"

import { BackgroundCredentialOperation, BackgroundCredentialOperationSubscriber } from "../background/credential/component"

import { CredentialComponent, CredentialParam, CredentialParamPacker } from "./component/credential/component"
import { ApplicationComponent, ApplicationParam, ApplicationParamPacker } from "./component/application/component"

import { PasswordLoginComponent } from "./component/password_login/component"
import { PasswordResetSessionComponent } from "./component/password_reset_session/component"
import { PasswordResetComponent, PasswordResetParam, PasswordResetParamPacker } from "./component/password_reset/component"

import { PasswordLoginInit } from "../password_login/action"

export interface AuthUsecase {
    href: AppHref
    component: AuthComponent
    onStateChange(stateChanged: Post<AuthState>): void
    init(): AuthUsecaseResource

    initPasswordLogin(): ViewResource<PasswordLoginView>
}
export type AuthUsecaseResource = ComponentResource<AuthOperation>

export type PasswordLoginView = Readonly<{
    passwordLogin: PasswordLoginComponent
}>

export type AuthParam = Readonly<{
    credential: CredentialParamPacker
    application: ApplicationParamPacker

    passwordReset: PasswordResetParamPacker
}>

export type AuthBackground = Readonly<{
    credential: Post<BackgroundCredentialOperation>
}>
export type AuthBackgroundSubscriber = Readonly<{
    credential: BackgroundCredentialOperationSubscriber
}>

export type AuthComponent = Readonly<{
    credential: CredentialComponent
    application: ApplicationComponent

    passwordLogin: Init<PasswordLoginComponent>
    passwordResetSession: PasswordResetSessionComponent
    passwordReset: PasswordResetComponent
}>

export type AuthAction = Readonly<{
    passwordLogin: Init<PasswordLoginInit>
}>

export type AuthState =
    Readonly<{ type: "initial" }> |
    Readonly<{ type: "credential", param: CredentialParam }> |
    Readonly<{ type: "application", param: ApplicationParam }> |
    Readonly<{ type: "password-login" }> |
    Readonly<{ type: "password-reset-session" }> |
    Readonly<{ type: "password-reset", param: PasswordResetParam }> |
    Readonly<{ type: "error", err: string }>

export const initialAuthState: AuthState = { type: "initial" }

export type AuthOperation =
    Readonly<{ type: "renew" }>

export const initialAuthRequest: Post<AuthOperation> = (): void => {
    throw new Error("Usecase is not initialized. use: `init()`")
}

interface Post<T> {
    (state: T): void
}
interface Init<T> {
    (): T
}
interface Terminate {
    (): void
}

type ComponentResource<T> = Readonly<{
    request: Post<T>
    terminate: Terminate
}>

type ViewResource<T> = Readonly<{
    view: T
    terminate: Terminate
}>
