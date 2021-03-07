import { initMockLogoutCoreAction } from "./Core/mock"

import { LogoutResource } from "./resource"

export function initMockLogoutResource(): LogoutResource {
    return { logout: initMockLogoutCoreAction() }
}
