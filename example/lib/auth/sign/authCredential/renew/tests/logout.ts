import { logout } from "../impl"

import { AuthCredentialRepository } from "../infra"

import { LogoutAction } from "../action"
import { ApiCredentialRepository } from "../../../../../common/auth/apiCredential/infra"

export function initTestLogoutAction(
    apiCredentials: ApiCredentialRepository,
    authCredentials: AuthCredentialRepository
): LogoutAction {
    return {
        logout: logout({
            apiCredentials,
            authCredentials,
        }),
    }
}
