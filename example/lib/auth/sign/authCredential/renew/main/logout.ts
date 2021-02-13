import { initAuthCredentialRepository } from "../infra/repository/authCredential"

import { logout } from "../impl"

import { LogoutInfra } from "../infra"

import { LogoutAction } from "../action"
import { initAuthCredentialStorage } from "./common"
import { newApiCredentialRepository } from "../../../../../common/auth/apiCredential/main"

export function initLogoutAction(credentialStorage: Storage): LogoutAction {
    return {
        logout: logout(logoutInfra()),
    }

    function logoutInfra(): LogoutInfra {
        return {
            apiCredentials: newApiCredentialRepository(credentialStorage),
            authCredentials: initAuthCredentialRepository(initAuthCredentialStorage(credentialStorage)),
        }
    }
}
