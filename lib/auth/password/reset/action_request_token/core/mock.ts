import { ApplicationMockStateAction } from "../../../../../z_vendor/getto-application/action/mock"

import {
    initialRequestResetTokenCoreState,
    RequestResetTokenCoreAction,
    RequestResetTokenCoreState,
} from "./action"

export function mockRequestResetTokenCoreAction(): RequestResetTokenCoreAction {
    return new Action()
}

export class Action
    extends ApplicationMockStateAction<RequestResetTokenCoreState>
    implements RequestResetTokenCoreAction {
    readonly initialState = initialRequestResetTokenCoreState

    async submit(): Promise<RequestResetTokenCoreState> {
        return this.initialState
    }
}
