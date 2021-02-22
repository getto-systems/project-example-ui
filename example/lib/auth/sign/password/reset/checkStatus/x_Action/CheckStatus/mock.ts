import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"

import {
    CheckPasswordResetSendingStatusAction,
    CheckPasswordResetSendingStatusResource,
    CheckPasswordResetSendingStatusState,
} from "./action"
import { MockAction_simple } from "../../../../../../../z_getto/application/mock"

export function initMockStartPasswordResetSessionResource(): CheckPasswordResetSendingStatusResource {
    return {
        checkStatus: initMockStartPasswordResetSendingStatusAction(),
        ...newAuthSignLinkResource(),
    }
}

export function initMockStartPasswordResetSendingStatusAction(): CheckPasswordResetSendingStatusAction {
    return new Action()
}

export class Action
    extends MockAction_simple<CheckPasswordResetSendingStatusState>
    implements CheckPasswordResetSendingStatusAction {}
