import { logout } from "../impl/core"

import { AuthCredentialRepository } from "../infra"

import { LogoutAction } from "../action"

export function initTestLogoutAction(authCredentials: AuthCredentialRepository): LogoutAction {
    return {
        logout: logout({
            authCredentials,
        }),
    }
}
