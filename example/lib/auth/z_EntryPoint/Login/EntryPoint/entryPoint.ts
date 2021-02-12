import { RenewCredentialForegroundAction, RenewCredentialResource } from "../../../x_Resource/Login/RenewCredential/resource"
import {
    PasswordLoginBackgroundAction,
    PasswordLoginForegroundAction,
    PasswordLoginResource,
} from "../../../x_Resource/Login/PasswordLogin/resource"
import {
    PasswordResetBackgroundAction,
    PasswordResetForegroundAction,
    PasswordResetResource,
} from "../../../x_Resource/Profile/PasswordReset/resource"
import {
    PasswordResetSessionBackgroundAction,
    PasswordResetSessionForegroundAction,
    PasswordResetSessionResource,
} from "../../../x_Resource/Profile/PasswordResetSession/resource"

import { ApplicationComponent } from "../../../../sub/getto-example/x_components/Application/component"

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

interface Terminate {
    (): void
}
