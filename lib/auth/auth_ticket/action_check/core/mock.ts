import { ApplicationMockStateAction } from "../../../../z_vendor/getto-application/action/mock"

import { CheckAuthTicketCoreAction, CheckAuthTicketCoreState, initialCheckAuthTicketCoreState } from "./action"

export function mockCheckAuthTicketCoreAction(): CheckAuthTicketCoreAction {
    return new Action()
}

class Action
    extends ApplicationMockStateAction<CheckAuthTicketCoreState>
    implements CheckAuthTicketCoreAction {
    readonly initialState = initialCheckAuthTicketCoreState

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
