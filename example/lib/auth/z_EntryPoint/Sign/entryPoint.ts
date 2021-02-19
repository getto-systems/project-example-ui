import { RenewAuthnInfoResource } from "../../sign/kernel/authnInfo/renew/x_Action/Renew/action"
import { AuthenticatePasswordEntryPoint } from "../../sign/password/authenticate/x_Action/Authenticate/action"
import { RegisterPasswordResource } from "../../x_Resource/Sign/Password/ResetSession/Register/resource"
import { StartPasswordResetSessionResource } from "../../x_Resource/Sign/Password/ResetSession/Start/resource"

import { ApplicationAction } from "../../../common/vendor/getto-example/Application/action"
import { AuthSignLinkResource } from "../../sign/common/searchParams/x_Action/Link/action"

export type AuthSignEntryPoint = Readonly<{
    view: AuthSignView
    terminate: Terminate
}>

export type RenewCredentialEntryPoint = EntryPoint<RenewAuthnInfoResource>
export type PasswordResetSessionEntryPoint = EntryPoint<
    StartPasswordResetSessionResource & AuthSignLinkResource
>
export type PasswordResetEntryPoint = EntryPoint<RegisterPasswordResource & AuthSignLinkResource>

export interface AuthSignResourceFactory {
    link(): AuthSignLinkResource

    // TODO 階層構造に合わせて rename
    renew(): RenewAuthnInfoResource

    passwordLogin(): AuthenticatePasswordEntryPoint
    passwordResetSession(): StartPasswordResetSessionResource
    passwordReset(): RegisterPasswordResource
}

export interface AuthSignViewLocationInfo {
    getAuthSignViewType(): AuthSignViewType
}

export interface AuthSignView extends ApplicationAction<AuthSignViewState> {
    load(): void
}

    // TODO 階層構造に合わせて rename
export type AuthSignViewState =
    | Readonly<{ type: "initial-view" }>
    | Readonly<{ type: "renew-credential"; entryPoint: RenewCredentialEntryPoint }>
    | Readonly<{ type: "password-login"; entryPoint: AuthenticatePasswordEntryPoint }>
    | Readonly<{
          type: "password-reset-session"
          entryPoint: PasswordResetSessionEntryPoint
      }>
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
