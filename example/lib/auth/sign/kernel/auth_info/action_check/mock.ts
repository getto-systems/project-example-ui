import { mockCheckAuthInfoCoreAction } from "./core/mock"

import { CheckAuthInfoResource } from "./entry_point"

export function mockCheckAuthInfoResource(): CheckAuthInfoResource {
    return { core: mockCheckAuthInfoCoreAction() }
}
