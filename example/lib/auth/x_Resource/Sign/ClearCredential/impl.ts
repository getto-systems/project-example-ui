import { initLogoutComponent } from "./Logout/impl"

import { ClearCredentialForegroundAction, ClearCredentialResource } from "./resource"

export function initClearCredentialResource(
    foreground: ClearCredentialForegroundAction
): ClearCredentialResource {
    return {
        logout: initLogoutComponent(foreground),
    }
}
