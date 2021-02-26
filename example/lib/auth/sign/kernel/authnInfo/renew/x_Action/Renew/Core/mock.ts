import { ApplicationMockStateAction } from "../../../../../../../../z_vendor/getto-application/action/impl"

import { CoreAction, CoreState } from "./action"

export function initMockCoreAction(): CoreAction {
    return new Action()
}

class Action extends ApplicationMockStateAction<CoreState> implements CoreAction {
    readonly initialState: CoreState = { type: "initial-renew" }

    constructor() {
        super()
        this.addMockIgniter(() => ({ type: "required-to-login" }))
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
