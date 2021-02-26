import { ApplicationMockStateAction } from "../../../../z_vendor/getto-application/action/impl"

import { AuthSignAction, AuthSignActionState } from "./entryPoint"

export function initMockAuthSignAction(): AuthSignAction {
    return new Action()
}

class Action extends ApplicationMockStateAction<AuthSignActionState> implements AuthSignAction {
    readonly initialState: AuthSignActionState = { type: "initial-view" }

    error(): void {
        // mock では特に何もしない
    }
}
