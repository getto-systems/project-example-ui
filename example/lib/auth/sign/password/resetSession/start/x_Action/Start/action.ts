import {
    initialValidateBoardState,
    ValidateBoardState,
} from "../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { AuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/action"
import {
    initialStartPasswordResetSessionCoreState,
    StartPasswordResetSessionCoreAction,
    StartPasswordResetSessionCoreState,
} from "./Core/action"
import { StartPasswordResetSessionFormAction } from "./Form/action"

export type StartPasswordResetSessionEntryPoint = Readonly<{
    resource: StartPasswordResetSessionResource
    terminate: { (): void }
}>

export type StartPasswordResetSessionResource = AuthSignLinkResource &
    Readonly<{
        start: StartPasswordResetSessionAction
    }>

export type StartPasswordResetSessionAction = Readonly<{
    core: StartPasswordResetSessionCoreAction
    form: StartPasswordResetSessionFormAction
}>

export type StartPasswordResetSessionResourceState = Readonly<{
    core: StartPasswordResetSessionCoreState
    form: ValidateBoardState
}>
export const initialStartPasswordResetSessionState: StartPasswordResetSessionResourceState = {
    core: initialStartPasswordResetSessionCoreState,
    form: initialValidateBoardState,
}
