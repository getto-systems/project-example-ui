import { ApplicationMockStateAction } from "../../../../../../../z_vendor/getto-application/action/impl"
import { CoreAction, CoreState } from "./action"

export function initMockCoreAction(): CoreAction {
    return new Action()
}

class Action extends ApplicationMockStateAction<CoreState> implements CoreAction {
    readonly initialState: CoreState = { type: "initial-login" }

    submit(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}
