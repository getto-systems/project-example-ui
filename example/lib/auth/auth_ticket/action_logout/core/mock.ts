import { ApplicationMockStateAction } from "../../../../z_vendor/getto-application/action/mock"
import { initialLogoutCoreState, LogoutCoreAction, LogoutCoreState } from "./action"

export function mockLogoutCoreAction(): LogoutCoreAction {
    return new Action()
}

class Action extends ApplicationMockStateAction<LogoutCoreState> implements LogoutCoreAction {
    readonly initialState = initialLogoutCoreState
    submit() {
        // mock では特に何もしない
    }
}
