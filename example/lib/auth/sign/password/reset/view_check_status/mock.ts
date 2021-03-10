import { mockCheckResetTokenSendingStatusCoreAction } from "./core/mock"

import { initSignLinkResource } from "../../../common/link/action/impl"

import { CheckResetTokenSendingStatusResource } from "./entry_point"

export function mockStartPasswordResetSessionResource(): CheckResetTokenSendingStatusResource {
    return {
        checkStatus: mockCheckResetTokenSendingStatusCoreAction(),
        ...initSignLinkResource(),
    }
}
