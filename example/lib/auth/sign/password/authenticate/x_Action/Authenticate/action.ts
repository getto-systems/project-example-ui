import { initialValidateBoardState } from "../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { AuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/action"
import { AuthenticatePasswordCoreAction, initialAuthenticatePasswordCoreState } from "./Core/action"
import { AuthenticatePasswordFormAction } from "./Form/action"

export type AuthenticatePasswordEntryPoint = Readonly<{
    resource: AuthenticatePasswordAction & AuthSignLinkResource
    terminate: { (): void }
}>
export type AuthenticatePasswordAction = Readonly<{
    core: AuthenticatePasswordCoreAction
    form: AuthenticatePasswordFormAction
}>

export const initialAuthenticatePasswordState = {
    core: initialAuthenticatePasswordCoreState,
    form: initialValidateBoardState,
} as const
