import { RenewAuthnInfoEntryPoint } from "../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/action"
import { AuthenticatePasswordEntryPoint } from "../../../../auth/sign/password/authenticate/x_Action/Authenticate/action"
import { RegisterPasswordEntryPoint } from "../../../../auth/sign/password/resetSession/register/x_Action/Register/action"
import { StartPasswordResetSessionResource } from "../../../../auth/x_Resource/Sign/Password/ResetSession/Start/resource"

import { ApplicationAction } from "../../../../z_getto/application/action"
import { AuthSignLinkResource } from "../../../../auth/sign/common/searchParams/x_Action/Link/action"

export type AuthSignEntryPoint = Readonly<{
    view: AuthSignView
    terminate: Terminate
}>

export type PasswordResetSessionEntryPoint = EntryPoint<
    StartPasswordResetSessionResource & AuthSignLinkResource
>

export interface AuthSignResourceFactory {
    link(): AuthSignLinkResource

    // TODO 階層構造に合わせて rename
    renew(): RenewAuthnInfoEntryPoint

    passwordLogin(): AuthenticatePasswordEntryPoint
    passwordResetSession(): StartPasswordResetSessionResource
    passwordReset(): RegisterPasswordEntryPoint
}

export interface AuthSignViewLocationInfo {
    getAuthSignViewType(): AuthSignViewType
}

export type AuthSignView = ApplicationAction<AuthSignViewState>

// TODO 階層構造に合わせて rename
export type AuthSignViewState =
    | Readonly<{ type: "initial-view" }>
    | Readonly<{ type: "renew-credential"; entryPoint: RenewAuthnInfoEntryPoint }>
    | Readonly<{ type: "password-login"; entryPoint: AuthenticatePasswordEntryPoint }>
    | Readonly<{
          type: "password-reset-session"
          entryPoint: PasswordResetSessionEntryPoint
      }>
    | Readonly<{ type: "password-reset"; entryPoint: RegisterPasswordEntryPoint }>
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
