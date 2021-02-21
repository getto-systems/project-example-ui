import { initialValidateBoardState } from "../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { AuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/action"
import { AuthenticatePasswordCoreAction, initialAuthenticatePasswordCoreState } from "./Core/action"
import { AuthenticatePasswordFormAction } from "./Form/action"

export type AuthenticatePasswordEntryPoint = Readonly<{
    resource: AuthenticatePasswordResource
    terminate: { (): void }
}>
export type AuthenticatePasswordResource = AuthenticatePasswordAction & AuthSignLinkResource
export interface AuthenticatePasswordAction {
    readonly core: AuthenticatePasswordCoreAction
    readonly form: AuthenticatePasswordFormAction
}

export const initialAuthenticatePasswordState = {
    core: initialAuthenticatePasswordCoreState,
    form: initialValidateBoardState,
} as const
