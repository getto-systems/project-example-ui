import { RenewAuthCredentialForegroundAction, AuthSignAuthCredentialClearResource } from "../../x_Resource/sign/authCredential/Renew/resource"
import {
    PasswordLoginBackgroundActionPod,
    PasswordLoginForegroundAction,
    PasswordLoginResource,
} from "../../x_Resource/sign/PasswordLogin/resource"
import {
    PasswordResetBackgroundActionPod,
    PasswordResetForegroundAction,
    PasswordResetResource,
} from "../../x_Resource/sign/PasswordReset/resource"
import {
    PasswordResetSessionBackgroundActionPod,
    PasswordResetSessionForegroundAction,
    PasswordResetSessionResource,
} from "../../x_Resource/sign/PasswordResetSession/resource"

import { ApplicationComponent } from "../../../vendor/getto-example/Application/component"
import { SignLinkResource } from "./Link/resource"

export type LoginForegroundAction = RenewAuthCredentialForegroundAction &
    PasswordLoginForegroundAction &
    PasswordResetSessionForegroundAction &
    PasswordResetForegroundAction

export type LoginBackgroundActionPod = PasswordLoginBackgroundActionPod &
    PasswordResetSessionBackgroundActionPod &
    PasswordResetBackgroundActionPod

export type LoginEntryPoint = Readonly<{
    view: LoginView
    terminate: Terminate
}>
export type RenewCredentialEntryPoint = EntryPoint<AuthSignAuthCredentialClearResource>
export type PasswordLoginEntryPoint = EntryPoint<PasswordLoginResource & SignLinkResource>
export type PasswordResetSessionEntryPoint = EntryPoint<PasswordResetSessionResource & SignLinkResource>
export type PasswordResetEntryPoint = EntryPoint<PasswordResetResource & SignLinkResource>

export interface LoginResourceFactory {
    loginLink(): SignLinkResource

    renewCredential(): AuthSignAuthCredentialClearResource

    passwordLogin(): PasswordLoginResource
    passwordResetSession(): PasswordResetSessionResource
    passwordReset(): PasswordResetResource
}

export interface LoginViewLocationInfo {
    login: Readonly<{
        getLoginView(): ViewState
    }>
}

export interface LoginView extends ApplicationComponent<LoginState> {
    load(): void
}

export type LoginState =
    | Readonly<{ type: "initial-view" }>
    | Readonly<{ type: "renew-credential"; entryPoint: RenewCredentialEntryPoint }>
    | Readonly<{ type: "password-login"; entryPoint: PasswordLoginEntryPoint }>
    | Readonly<{ type: "password-reset-session"; entryPoint: PasswordResetSessionEntryPoint }>
    | Readonly<{ type: "password-reset"; entryPoint: PasswordResetEntryPoint }>
    | Readonly<{ type: "error"; err: string }>

export type ViewState = "password-login" | "password-reset-session" | "password-reset"

export const initialLoginState: LoginState = { type: "initial-view" }

type EntryPoint<R> = Readonly<{
    resource: R
    terminate: Terminate
}>
interface Terminate {
    (): void
}
