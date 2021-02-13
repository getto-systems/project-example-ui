import { initClearAction } from "../../../sign/authCredential/clear/impl"
import { LogoutMaterial } from "./Logout/component"
import { initLogoutComponent } from "./Logout/impl"
import { ClearCredentialForegroundActionPod, ClearCredentialResource } from "./resource"

export function initClearCredentialResource(
    foreground: ClearCredentialForegroundActionPod
): ClearCredentialResource {
    return {
        logout: initLogoutComponent(logoutMaterial()),
    }

    function logoutMaterial(): LogoutMaterial {
        return {
            clear: initClearAction(foreground.initClear),
        }
    }
}
