import { initMockLogoutCoreAction } from "./core/mock"

import { LogoutResource } from "./resource"

export function initMockLogoutResource(): LogoutResource {
    return { logout: initMockLogoutCoreAction() }
}
