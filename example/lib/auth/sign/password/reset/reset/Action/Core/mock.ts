import { ApplicationMockStateAction } from "../../../../../../../z_vendor/getto-application/action/mock"

import {
    initialResetPasswordCoreState,
    ResetPasswordCoreAction,
    ResetPasswordCoreState,
} from "./action"

export function initMockResetPasswordCoreAction(): ResetPasswordCoreAction {
    return new Action()
}

class Action
    extends ApplicationMockStateAction<ResetPasswordCoreState>
    implements ResetPasswordCoreAction {
    readonly initialState = initialResetPasswordCoreState

    submit(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}
