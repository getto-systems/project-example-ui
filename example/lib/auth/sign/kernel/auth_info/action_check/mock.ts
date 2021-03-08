import { initMockCheckAuthInfoCoreAction } from "./core/mock"

import { CheckAuthInfoResource } from "./entry_point"

export function initMockCheckAuthInfoResource(): CheckAuthInfoResource {
    return { core: initMockCheckAuthInfoCoreAction() }
}
