import { initClearAuthCredentialComponent } from "../../../../sign/x_Component/AuthCredential/Clear/impl"

import { AuthProfileLogoutResource, AuthProfileLogoutMaterial } from "./resource"

export function initAuthProfileLogoutResource(
    material: AuthProfileLogoutMaterial
): AuthProfileLogoutResource {
    return {
        clear: initClearAuthCredentialComponent(material),
    }
}
