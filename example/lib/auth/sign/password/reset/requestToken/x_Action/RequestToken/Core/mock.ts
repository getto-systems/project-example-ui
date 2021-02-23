import { MockStateAction_simple } from "../../../../../../../../z_getto/application/mock"

import { RequestPasswordResetTokenCoreAction, RequestPasswordResetTokenCoreState } from "./action"

export function initMockRequestPasswordResetTokenCoreAction(): RequestPasswordResetTokenCoreAction {
    return new Action()
}

export class Action
    extends MockStateAction_simple<RequestPasswordResetTokenCoreState>
    implements RequestPasswordResetTokenCoreAction {
    submit(): void {
        // mock では特に何もしない
    }
}
