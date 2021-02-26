import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"

import {
    CheckPasswordResetSendingStatusAction,
    CheckPasswordResetSendingStatusResource,
    CheckSendingStatusState,
} from "./action"
import { ApplicationMockStateAction } from "../../../../../../../z_getto/action/impl"

export function initMockStartPasswordResetSessionResource(): CheckPasswordResetSendingStatusResource {
    return {
        checkStatus: new Action(),
        ...newAuthSignLinkResource(),
    }
}

export class Action
    extends ApplicationMockStateAction<CheckSendingStatusState>
    implements CheckPasswordResetSendingStatusAction {
    readonly initialState: CheckSendingStatusState = { type: "initial-check-status" }
}
