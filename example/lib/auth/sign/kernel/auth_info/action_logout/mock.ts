import { initMockLogoutCoreAction } from "./core/mock"

import { LogoutResource } from "./resource"

export function standard_MockLogoutResource(): LogoutResource {
    return { logout: initMockLogoutCoreAction() }
}
