import { ApplicationMockStateAction } from "../../../../../../../z_vendor/getto-application/action/impl"
import { initialLogoutCoreState, LogoutCoreAction, LogoutCoreState } from "./action"

export function initMockLogoutCoreAction(): LogoutCoreAction {
    return new Action()
}

class Action extends ApplicationMockStateAction<LogoutCoreState> implements LogoutCoreAction {
    readonly initialState = initialLogoutCoreState
    submit() {
        // mock では特に何もしない
    }
}
