import { MockAction_simple } from "../../../../../../../../z_getto/application/mock"

import { RegisterPasswordCoreAction, RegisterPasswordCoreState } from "./action"

export function initMockRegisterPasswordCoreAction(): RegisterPasswordCoreAction {
    return new Action()
}

class Action
    extends MockAction_simple<RegisterPasswordCoreState>
    implements RegisterPasswordCoreAction {
    submit(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}
