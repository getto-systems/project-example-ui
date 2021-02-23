import { MockStateAction_simple } from "../../../../z_getto/application/mock"

import { AuthSignAction, AuthSignActionState } from "./entryPoint"

export function initMockAuthSignAction(): AuthSignAction {
    return new Action()
}

class Action extends MockStateAction_simple<AuthSignActionState> implements AuthSignAction {
    error(): void {
        // mock では特に何もしない
    }
}
