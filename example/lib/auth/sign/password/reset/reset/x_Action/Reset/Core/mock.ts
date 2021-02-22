import { MockAction_simple } from "../../../../../../../../z_getto/application/mock"

import { ResetPasswordCoreAction, ResetPasswordCoreState } from "./action"

export function initMockResetPasswordCoreAction(): ResetPasswordCoreAction {
    return new Action()
}

class Action extends MockAction_simple<ResetPasswordCoreState> implements ResetPasswordCoreAction {
    submit(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}
