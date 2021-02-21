import { MockAction_simple } from "../../../../z_getto/application/mock"

import { AuthSignAction, AuthSignActionState } from "./entryPoint"

export function initMockAuthSignAction(): AuthSignAction {
    return new Action()
}

class Action extends MockAction_simple<AuthSignActionState> implements AuthSignAction {
    load(): void {
        // mock では特に何もしない
    }
}
