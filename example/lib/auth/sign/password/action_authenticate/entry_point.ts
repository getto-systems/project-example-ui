import {
    ApplicationAction,
    ApplicationEntryPoint,
} from "../../../../z_vendor/getto-application/action/action"

import { SignLinkResource } from "../../common/nav/action_nav/resource"
import { ValidateBoardActionState } from "../../../../z_vendor/getto-application/board/action_validate_board/core/action"
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
