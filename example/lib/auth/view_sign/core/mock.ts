import { ApplicationMockStateAction } from "../../../z_vendor/getto-application/action/mock"

import { initialSignViewState, SignAction, SignActionState } from "./action"

export function mockSignAction(): SignAction {
    return new Action()
}

class Action extends ApplicationMockStateAction<SignActionState> implements SignAction {
    readonly initialState = initialSignViewState

    error(): void {
        // mock では特に何もしない
    }
}
