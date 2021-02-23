import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"

import {
    CheckPasswordResetSendingStatusAction,
    CheckPasswordResetSendingStatusResource,
    CheckSendingStatusState,
} from "./action"
import { MockStateAction_simple } from "../../../../../../../z_getto/application/mock"

export function initMockStartPasswordResetSessionResource(): CheckPasswordResetSendingStatusResource {
    return {
        checkStatus: new Action(),
        ...newAuthSignLinkResource(),
    }
}

export class Action
    extends MockStateAction_simple<CheckSendingStatusState>
    implements CheckPasswordResetSendingStatusAction {}
