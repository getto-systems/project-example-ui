import { initMockCheckResetTokenSendingStatusCoreAction } from "./core/mock"

import { initSignLinkResource } from "../../../common/link/action/impl"

import { CheckResetTokenSendingStatusResource } from "./entry_point"

export function initMockStartPasswordResetSessionResource(): CheckResetTokenSendingStatusResource {
    return {
        checkStatus: initMockCheckResetTokenSendingStatusCoreAction(),
        ...initSignLinkResource(),
    }
}
