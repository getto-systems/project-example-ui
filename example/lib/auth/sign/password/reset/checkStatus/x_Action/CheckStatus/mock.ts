import { initSignLinkResource } from "../../../../../common/link/Action/impl"

import {
    CheckPasswordResetSendingStatusAction,
    CheckPasswordResetSendingStatusResource,
    CheckSendingStatusState,
} from "./action"
import { ApplicationMockStateAction } from "../../../../../../../z_vendor/getto-application/action/impl"

export function initMockStartPasswordResetSessionResource(): CheckPasswordResetSendingStatusResource {
    return {
        checkStatus: new Action(),
        ...initSignLinkResource(),
    }
}

export class Action
    extends ApplicationMockStateAction<CheckSendingStatusState>
    implements CheckPasswordResetSendingStatusAction {
    readonly initialState: CheckSendingStatusState = { type: "initial-check-status" }
}
