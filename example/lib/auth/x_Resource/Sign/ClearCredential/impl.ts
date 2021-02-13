import { LogoutMaterial } from "./Logout/component"
import { initLogoutComponent } from "./Logout/impl"
import { ClearCredentialForegroundAction, ClearCredentialResource } from "./resource"

export function initClearCredentialResource(
    foreground: ClearCredentialForegroundAction
): ClearCredentialResource {
    return {
        logout: initLogoutComponent(logoutMaterial()),
    }

    function logoutMaterial(): LogoutMaterial {
        return {
            logout: foreground.logout.logout(),
        }
    }
}
