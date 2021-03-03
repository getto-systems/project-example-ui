import { initMockCoreAction } from "./Core/mock"

import { CheckAuthInfoResource } from "./action"

export function initMockRenewAuthnInfoResource(): CheckAuthInfoResource {
    return { core: initMockCoreAction() }
}
