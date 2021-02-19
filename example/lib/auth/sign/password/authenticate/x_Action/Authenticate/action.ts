import { initialValidateBoardState } from "../../../../../../common/vendor/getto-board/validateBoard/x_Action/ValidateBoard/action"
import { AuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/action"
import { AuthenticatePasswordCoreAction, initialAuthenticatePasswordCoreState } from "./Core/action"
import { AuthenticatePasswordFormResource } from "./Form/action"

export type AuthenticatePasswordEntryPoint = Readonly<{
    resource: AuthenticatePasswordResource & AuthSignLinkResource
    terminate: { (): void }
}>
export type AuthenticatePasswordResource = Readonly<{
    core: AuthenticatePasswordCoreAction
    form: AuthenticatePasswordFormResource
}>

export const initialAuthenticatePasswordState = {
    core: initialAuthenticatePasswordCoreState,
    form: initialValidateBoardState,
} as const
