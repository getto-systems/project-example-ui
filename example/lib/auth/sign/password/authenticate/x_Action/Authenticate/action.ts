import { ApplicationAction } from "../../../../../../z_getto/application/action"
import {
    initialValidateBoardState,
    ValidateBoardState,
} from "../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { AuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/action"
import {
    AuthenticatePasswordCoreAction,
    AuthenticatePasswordCoreState,
    initialAuthenticatePasswordCoreState,
} from "./Core/action"
import { AuthenticatePasswordFormAction } from "./Form/action"

export type AuthenticatePasswordEntryPoint = Readonly<{
    resource: AuthenticatePasswordResource
    terminate: { (): void }
}>

export type AuthenticatePasswordResource = AuthSignLinkResource &
    Readonly<{ authenticate: AuthenticatePasswordAction }>

export interface AuthenticatePasswordAction extends ApplicationAction {
    readonly core: AuthenticatePasswordCoreAction
    readonly form: AuthenticatePasswordFormAction
}

export type AuthenticatePasswordResourceState = Readonly<{
    core: AuthenticatePasswordCoreState
    form: ValidateBoardState
}>
export const initialAuthenticatePasswordState: AuthenticatePasswordResourceState = {
    core: initialAuthenticatePasswordCoreState,
    form: initialValidateBoardState,
}
