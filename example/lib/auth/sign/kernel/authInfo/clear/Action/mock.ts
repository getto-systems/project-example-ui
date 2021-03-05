import { initMockLogoutCoreAction } from "./Core/mock"

import { LogoutResource } from "./action"

export function initMockLogoutResource(): LogoutResource {
    return { logout: initMockLogoutCoreAction() }
}
