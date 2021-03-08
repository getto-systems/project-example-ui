import { ApplicationMockStateAction } from "../../../../../z_vendor/getto-application/action/mock"

import { SignAction, SignActionState } from "./action"

export function initMockSignAction(): SignAction {
    return new Action()
}

class Action extends ApplicationMockStateAction<SignActionState> implements SignAction {
    readonly initialState: SignActionState = { type: "initial-view" }

    error(): void {
        // mock では特に何もしない
    }
}
