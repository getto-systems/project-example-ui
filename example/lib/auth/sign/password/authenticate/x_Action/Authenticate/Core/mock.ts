import { MockStateAction_simple } from "../../../../../../../z_getto/application/mock"

import { AuthenticatePasswordCoreAction, AuthenticatePasswordCoreState } from "./action"

export function initMockAuthenticatePasswordCoreAction(): AuthenticatePasswordCoreAction {
    return new Action()
}

class Action
    extends MockStateAction_simple<AuthenticatePasswordCoreState>
    implements AuthenticatePasswordCoreAction {
    submit(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}
