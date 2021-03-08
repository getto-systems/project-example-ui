import {
    ApplicationAction,
    ApplicationEntryPoint,
} from "../../../../z_vendor/getto-application/action/action"

import { SignLinkResource } from "../../common/link/action/resource"
import { ValidateBoardActionState } from "../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { AuthenticatePasswordCoreAction, AuthenticatePasswordCoreState } from "./core/action"
import { AuthenticatePasswordFormAction } from "./form/action"

export type AuthenticatePasswordEntryPoint = ApplicationEntryPoint<AuthenticatePasswordResource>

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
