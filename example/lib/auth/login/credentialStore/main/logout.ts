import { initAuthCredentialRepository } from "../impl/repository/authCredential"

import { logout } from "../impl/core"

import { LogoutInfra } from "../infra"

import { LogoutAction } from "../action"
import { initAuthCredentialStorage } from "./common"

export function initLogoutAction(credentialStorage: Storage): LogoutAction {
    return {
        logout: logout(logoutInfra()),
    }

    function logoutInfra(): LogoutInfra {
        return {
            authCredentials: initAuthCredentialRepository(initAuthCredentialStorage(credentialStorage)),
        }
    }
}
