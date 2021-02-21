import { ApplicationAction } from "../../../../z_getto/application/action"
import { AuthSignLinkResource } from "../../../../auth/sign/common/searchParams/x_Action/Link/action"
import { RenewAuthnInfoEntryPoint } from "../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/action"
import { AuthenticatePasswordEntryPoint } from "../../../../auth/sign/password/authenticate/x_Action/Authenticate/action"
import { RegisterPasswordEntryPoint } from "../../../../auth/sign/password/resetSession/register/x_Action/Register/action"
import { StartPasswordResetSessionEntryPoint } from "../../../../auth/sign/password/resetSession/start/x_Action/Start/action"

export type AuthSignEntryPoint = Readonly<{
    resource: AuthSignResource
    terminate: Terminate
}>
export type AuthSignResource = Readonly<{
    view: AuthSignAction
}>

export interface AuthSignResourceFactory {
    link(): AuthSignLinkResource

    // TODO 階層構造に合わせて rename
    renew(): RenewAuthnInfoEntryPoint

    passwordLogin(): AuthenticatePasswordEntryPoint
    passwordResetSession(): StartPasswordResetSessionEntryPoint
    passwordReset(): RegisterPasswordEntryPoint
}

export interface AuthSignViewLocationInfo {
    getAuthSignViewType(): AuthSignViewType
}

export type AuthSignAction = ApplicationAction<AuthSignActionState>

// TODO 階層構造に合わせて rename
export type AuthSignActionState =
    | Readonly<{ type: "initial-view" }>
    | Readonly<{ type: "renew-credential"; entryPoint: RenewAuthnInfoEntryPoint }>
    | Readonly<{ type: "password-login"; entryPoint: AuthenticatePasswordEntryPoint }>
    | Readonly<{
          type: "password-reset-session"
          entryPoint: StartPasswordResetSessionEntryPoint
      }>
    | Readonly<{ type: "password-reset"; entryPoint: RegisterPasswordEntryPoint }>
    | Readonly<{ type: "error"; err: string }>

export type AuthSignViewType = "password-login" | "password-reset-session" | "password-reset"

export const initialAuthSignViewState: AuthSignActionState = { type: "initial-view" }

interface Terminate {
    (): void
}
