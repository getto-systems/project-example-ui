import { RenewAuthInfoResource } from "../../x_Resource/Sign/AuthInfo/Renew/resource"
import { AuthenticatePasswordResource } from "../../x_Resource/Sign/Password/Authenticate/resource"
import { RegisterPasswordResource } from "../../x_Resource/Sign/Password/ResetSession/Register/resource"
import { PasswordResetSessionResource } from "../../x_Resource/Sign/PasswordResetSession/resource"

import { ApplicationAction } from "../../../common/vendor/getto-example/Application/action"
import { AuthSignLinkResource } from "../../x_Resource/Sign/Link/resource"

export type AuthSignEntryPoint = Readonly<{
    view: AuthSignView
    terminate: Terminate
}>

export type RenewCredentialEntryPoint = EntryPoint<RenewAuthInfoResource>
export type PasswordLoginEntryPoint = EntryPoint<AuthenticatePasswordResource & AuthSignLinkResource>
export type PasswordResetSessionEntryPoint = EntryPoint<
    PasswordResetSessionResource & AuthSignLinkResource
>
export type PasswordResetEntryPoint = EntryPoint<RegisterPasswordResource & AuthSignLinkResource>

export interface AuthSignResourceFactory {
    link(): AuthSignLinkResource

    renew(): RenewAuthInfoResource

    passwordLogin(): AuthenticatePasswordResource
    passwordResetSession(): PasswordResetSessionResource
    passwordReset(): RegisterPasswordResource
}

export interface AuthSignViewLocationInfo {
    getAuthSignViewType(): AuthSignViewType
}

export interface AuthSignView extends ApplicationAction<AuthSignViewState> {
    load(): void
}

export type AuthSignViewState =
    | Readonly<{ type: "initial-view" }>
    | Readonly<{ type: "renew-credential"; entryPoint: RenewCredentialEntryPoint }>
    | Readonly<{ type: "password-login"; entryPoint: PasswordLoginEntryPoint }>
    | Readonly<{ type: "password-reset-session"; entryPoint: PasswordResetSessionEntryPoint }>
    | Readonly<{ type: "password-reset"; entryPoint: PasswordResetEntryPoint }>
    | Readonly<{ type: "error"; err: string }>

export type AuthSignViewType = "password-login" | "password-reset-session" | "password-reset"

export const initialAuthSignViewState: AuthSignViewState = { type: "initial-view" }

type EntryPoint<R> = Readonly<{
    resource: R
    terminate: Terminate
}>
interface Terminate {
    (): void
}
