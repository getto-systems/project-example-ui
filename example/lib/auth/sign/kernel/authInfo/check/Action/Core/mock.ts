import { ApplicationMockStateAction } from "../../../../../../../z_vendor/getto-application/action/mock"

import { CheckAuthInfoCoreAction, CheckAuthInfoCoreState, initialCheckAuthInfoCoreState } from "./action"

export function initMockCheckAuthInfoCoreAction(): CheckAuthInfoCoreAction {
    return new Action()
}

class Action
    extends ApplicationMockStateAction<CheckAuthInfoCoreState>
    implements CheckAuthInfoCoreAction {
    readonly initialState = initialCheckAuthInfoCoreState

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
