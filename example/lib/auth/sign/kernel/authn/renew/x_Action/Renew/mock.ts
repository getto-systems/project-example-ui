import { initMockCoreAction } from "./Core/mock"

import { RenewAuthnInfoResource } from "./action"

export function initMockRenewAuthnInfoResource(): RenewAuthnInfoResource {
    return { core: initMockCoreAction() }
}
