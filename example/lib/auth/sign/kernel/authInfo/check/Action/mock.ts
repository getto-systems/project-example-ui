import { initMockCheckAuthInfoCoreAction } from "./Core/mock"

import { CheckAuthInfoResource } from "./entryPoint"

export function initMockCheckAuthInfoResource(): CheckAuthInfoResource {
    return { core: initMockCheckAuthInfoCoreAction() }
}
