import { ApplicationAction } from "../../../../../z_vendor/getto-application/action/action"

import { SignLinkResource } from "../../../common/link/Action/action"
import { ValidateBoardActionState } from "../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { AuthenticatePasswordCoreAction, AuthenticatePasswordCoreState } from "./Core/action"
import { AuthenticatePasswordFormAction } from "./Form/action"

export type AuthenticatePasswordEntryPoint = Readonly<{
    resource: AuthenticatePasswordResource
    terminate: { (): void }
}>

export type AuthenticatePasswordResource = SignLinkResource &
    Readonly<{ authenticate: AuthenticatePasswordAction }>

export interface AuthenticatePasswordAction extends ApplicationAction {
    readonly core: AuthenticatePasswordCoreAction
    readonly form: AuthenticatePasswordFormAction
}

export type AuthenticatePasswordResourceState = Readonly<{
    state: Readonly<{
        core: AuthenticatePasswordCoreState
        form: ValidateBoardActionState
    }>
}>
