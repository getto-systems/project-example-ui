import { ApplicationMockStateAction } from "../../../../../../../../z_getto/action/impl"

import { CoreAction, CoreState } from "./action"

export function initMockResetPasswordCoreAction(): CoreAction {
    return new Action()
}

class Action extends ApplicationMockStateAction<CoreState> implements CoreAction {
    readonly initialState: CoreState = { type: "initial-reset" }

    submit(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}
