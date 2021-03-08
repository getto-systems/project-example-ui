import { ApplicationMockStateAction } from "../../../../../z_vendor/getto-application/action/mock"
import {
    AuthenticatePasswordCoreAction,
    AuthenticatePasswordCoreState,
    initialAuthenticatePasswordCoreState,
} from "./action"

export function initMockAuthenticatePasswordCoreAction(): AuthenticatePasswordCoreAction {
    return new Action()
}

class Action
    extends ApplicationMockStateAction<AuthenticatePasswordCoreState>
    implements AuthenticatePasswordCoreAction {
    readonly initialState = initialAuthenticatePasswordCoreState

    submit(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}
