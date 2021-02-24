import { MockStateAction_simple } from "../../../../../../../../z_getto/application/mock"

import { CoreAction, CoreState } from "./action"

export function initMockCoreAction(): CoreAction {
    return new Action()
}

class Action extends MockStateAction_simple<CoreState> implements CoreAction {
    submit() {
        // mock では特に何もしない
    }
}
