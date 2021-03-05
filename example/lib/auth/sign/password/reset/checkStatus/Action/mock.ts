import { initMockCheckResetTokenSendingStatusCoreAction } from "./Core/mock"

import { initSignLinkResource } from "../../../../common/link/Action/impl"

import { CheckResetTokenSendingStatusResource } from "./entryPoint"

export function initMockStartPasswordResetSessionResource(): CheckResetTokenSendingStatusResource {
    return {
        checkStatus: initMockCheckResetTokenSendingStatusCoreAction(),
        ...initSignLinkResource(),
    }
}
