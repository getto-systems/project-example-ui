import { initClearAuthCredentialComponent } from "./ClearAuthCredential/impl"

import { AuthProfileLogoutResource, AuthProfileLogoutMaterial } from "./resource"

export function initAuthProfileLogoutResource(
    material: AuthProfileLogoutMaterial
): AuthProfileLogoutResource {
    return {
        clearAuthCredential: initClearAuthCredentialComponent(material),
    }
}
