import { ApplicationMockStateAction } from "../../../../../../../z_vendor/getto-application/action/impl"

import {
    CheckResetTokenSendingStatusCoreAction,
    CheckResetTokenSendingStatusCoreState,
    initialCheckResetTokenSendingStatusCoreState,
} from "./action"

export function initMockCheckResetTokenSendingStatusCoreAction(): CheckResetTokenSendingStatusCoreAction {
    return new Action()
}

class Action
    extends ApplicationMockStateAction<CheckResetTokenSendingStatusCoreState>
    implements CheckResetTokenSendingStatusCoreAction {
    readonly initialState = initialCheckResetTokenSendingStatusCoreState
}
