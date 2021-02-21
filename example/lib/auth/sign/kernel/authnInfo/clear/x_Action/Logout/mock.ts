import { MockAction_simple } from "../../../../../../../z_getto/application/mock"

import { LogoutAction, LogoutState } from "./action"

export function initMockLogoutAction(): LogoutAction {
    return new Action()
}

class Action extends MockAction_simple<LogoutState> implements LogoutAction {
    submit() {
        // mock では特に何もしない
    }
}
