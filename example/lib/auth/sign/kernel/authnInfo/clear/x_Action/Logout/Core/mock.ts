import { ApplicationMockStateAction } from "../../../../../../../../z_getto/action/impl"
import { CoreAction, CoreState } from "./action"

export function initMockCoreAction(): CoreAction {
    return new Action()
}

class Action extends ApplicationMockStateAction<CoreState> implements CoreAction {
    readonly initialState: CoreState = { type: "initial-logout" }
    submit() {
        // mock では特に何もしない
    }
}
