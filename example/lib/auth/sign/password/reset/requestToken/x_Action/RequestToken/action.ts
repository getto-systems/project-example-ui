import {
    initialValidateBoardState,
    ValidateBoardState,
} from "../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { AuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/action"
import {
    initialRequestPasswordResetTokenCoreState,
    RequestPasswordResetTokenCoreAction,
    RequestPasswordResetTokenCoreState,
} from "./Core/action"
import { RequestPasswordResetTokenFormAction } from "./Form/action"

export type RequestPasswordResetTokenEntryPoint = Readonly<{
    resource: RequestPasswordResetTokenResource
    terminate: { (): void }
}>

export type RequestPasswordResetTokenResource = AuthSignLinkResource &
    Readonly<{
        request: RequestPasswordResetTokenAction
    }>

export type RequestPasswordResetTokenAction = Readonly<{
    core: RequestPasswordResetTokenCoreAction
    form: RequestPasswordResetTokenFormAction
}>

export type RequestPasswordResetTokenResourceState = Readonly<{
    core: RequestPasswordResetTokenCoreState
    form: ValidateBoardState
}>
export const initialRequestPasswordResetTokenState: RequestPasswordResetTokenResourceState = {
    core: initialRequestPasswordResetTokenCoreState,
    form: initialValidateBoardState,
}
