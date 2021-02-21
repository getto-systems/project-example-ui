import {
    initialValidateBoardState,
    ValidateBoardState,
} from "../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { AuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/action"
import {
    initialRegisterPasswordCoreState,
    RegisterPasswordCoreAction,
    RegisterPasswordCoreState,
} from "./Core/action"
import { RegisterPasswordFormAction } from "./Form/action"

export type RegisterPasswordEntryPoint = Readonly<{
    resource: RegisterPasswordResource
    terminate: { (): void }
}>

export type RegisterPasswordResource = AuthSignLinkResource &
    Readonly<{ reset: RegisterPasswordAction }>

export interface RegisterPasswordAction {
    core: RegisterPasswordCoreAction
    form: RegisterPasswordFormAction
}

export type RegisterPasswordResourceState = Readonly<{
    core: RegisterPasswordCoreState
    form: ValidateBoardState
}>
export const initialRegisterPasswordState: RegisterPasswordResourceState = {
    core: initialRegisterPasswordCoreState,
    form: initialValidateBoardState,
}
