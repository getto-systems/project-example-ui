import { MockStateAction_simple } from "../../../../../../../z_getto/application/mock"

import { LogoutAction, LogoutState } from "./action"

export function initMockLogoutAction(): LogoutAction {
    return new Action()
}

class Action extends MockStateAction_simple<LogoutState> implements LogoutAction {
    submit() {
        // mock では特に何もしない
    }
}
