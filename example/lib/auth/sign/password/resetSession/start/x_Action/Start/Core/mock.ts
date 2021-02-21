import { MockAction_simple } from "../../../../../../../../z_getto/application/mock"

import { StartPasswordResetSessionCoreAction, StartPasswordResetSessionCoreState } from "./action"

export function initMockStartPasswordResetSessionCoreAction(): StartPasswordResetSessionCoreAction {
    return new Action()
}

export class Action
    extends MockAction_simple<StartPasswordResetSessionCoreState>
    implements StartPasswordResetSessionCoreAction {
    submit(): void {
        // mock では特に何もしない
    }
}
