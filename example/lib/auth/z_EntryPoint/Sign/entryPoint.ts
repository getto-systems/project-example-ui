import { AuthSignRenewResource } from "./resources/Renew/resource"
import { AuthSignPasswordLoginResource } from "./resources/Password/Login/resource"
import { PasswordResetResource } from "../../x_Resource/sign/PasswordReset/resource"
import { PasswordResetSessionResource } from "../../x_Resource/sign/PasswordResetSession/resource"

import { ApplicationComponent } from "../../../vendor/getto-example/Application/component"
import { AuthSignLinkResource } from "./resources/Link/resource"

export type AuthSignEntryPoint = Readonly<{
    view: AuthSignView
    terminate: Terminate
}>

export type RenewCredentialEntryPoint = EntryPoint<AuthSignRenewResource>
export type PasswordLoginEntryPoint = EntryPoint<AuthSignPasswordLoginResource & AuthSignLinkResource>
export type PasswordResetSessionEntryPoint = EntryPoint<
    PasswordResetSessionResource & AuthSignLinkResource
>
export type PasswordResetEntryPoint = EntryPoint<PasswordResetResource & AuthSignLinkResource>

export interface AuthSignResourceFactory {
    link(): AuthSignLinkResource

    renew(): AuthSignRenewResource

    passwordLogin(): AuthSignPasswordLoginResource
    passwordResetSession(): PasswordResetSessionResource
    passwordReset(): PasswordResetResource
}

export interface AuthSignViewLocationInfo {
    getAuthSignViewType(): AuthSignViewType
}

export interface AuthSignView extends ApplicationComponent<AuthSignViewState> {
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
