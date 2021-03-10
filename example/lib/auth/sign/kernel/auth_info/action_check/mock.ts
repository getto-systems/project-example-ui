import { mockCheckAuthInfoCoreAction } from "./core/mock"

import { CheckAuthInfoEntryPoint, CheckAuthInfoResource } from "./entry_point"

export function mockCheckAuthInfoEntryPoint(): CheckAuthInfoEntryPoint {
    return {
        resource: mockCheckAuthInfoResource(),
        terminate: () => null,
    }
}
export function mockCheckAuthInfoResource(): CheckAuthInfoResource {
    return { core: mockCheckAuthInfoCoreAction() }
}
