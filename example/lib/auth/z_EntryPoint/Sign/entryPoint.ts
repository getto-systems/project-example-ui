import { RenewCredentialForegroundAction, RenewCredentialResource } from "../../x_Resource/Sign/RenewCredential/resource"
import {
    PasswordLoginBackgroundAction,
    PasswordLoginForegroundAction,
    PasswordLoginResource,
} from "../../x_Resource/Sign/PasswordLogin/resource"
import {
    PasswordResetBackgroundAction,
    PasswordResetForegroundAction,
    PasswordResetResource,
} from "../../x_Resource/Profile/PasswordReset/resource"
import {
    PasswordResetSessionBackgroundAction,
    PasswordResetSessionForegroundAction,
    PasswordResetSessionResource,
} from "../../x_Resource/Profile/PasswordResetSession/resource"

import { ApplicationComponent } from "../../../common/getto-example/Application/component"
import { LoginLinkResource } from "../../x_Resource/common/LoginLink/resource"

export type LoginForegroundAction = RenewCredentialForegroundAction &
    PasswordLoginForegroundAction &
    PasswordResetSessionForegroundAction &
    PasswordResetForegroundAction

export type LoginBackgroundAction = PasswordLoginBackgroundAction &
    PasswordResetSessionBackgroundAction &
    PasswordResetBackgroundAction

export type LoginEntryPoint = Readonly<{
    view: LoginView
    terminate: Terminate
}>
export type RenewCredentialEntryPoint = EntryPoint<RenewCredentialResource>
export type PasswordLoginEntryPoint = EntryPoint<PasswordLoginResource & LoginLinkResource>
export type PasswordResetSessionEntryPoint = EntryPoint<PasswordResetSessionResource & LoginLinkResource>
export type PasswordResetEntryPoint = EntryPoint<PasswordResetResource & LoginLinkResource>

export interface LoginResourceFactory {
    loginLink(): LoginLinkResource

    renewCredential(): RenewCredentialResource

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
