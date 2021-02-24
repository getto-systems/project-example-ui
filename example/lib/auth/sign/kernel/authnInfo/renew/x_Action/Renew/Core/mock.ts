import { MockStateAction_ignite } from "../../../../../../../../z_getto/application/mock"

import { CoreAction, CoreState } from "./action"

export function initMockCoreAction(): CoreAction {
    return new Action()
}

class Action extends MockStateAction_ignite<CoreState> implements CoreAction {
    constructor() {
        super(() => ({ type: "required-to-login" }))
    }

    request(): void {
        // mock では特に何もしない
    }
    succeedToInstantLoad(): void {
        // mock では特に何もしない
    }
    failedToInstantLoad(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}
