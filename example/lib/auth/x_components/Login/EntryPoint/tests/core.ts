import { delayed, wait } from "../../../../../z_infra/delayed/core"

import { LoginViewLocationInfo } from "../impl/core"
import { currentPagePathname, detectResetToken, detectViewState } from "../impl/location"

import { RenewCredentialLocationInfo } from "../impl/renew"
import { PasswordLoginLocationInfo } from "../impl/login"
import { PasswordResetLocationInfo } from "../impl/reset"

import { secureScriptPath } from "../../../../common/application/impl/core"
import { forceRenew, renew, setContinuousRenew } from "../../../../login/renew/impl/core"
import { login } from "../../../../login/passwordLogin/impl/core"
import { startSession, checkStatus, reset } from "../../../../profile/passwordReset/impl/core"

import { initMemoryTypedStorage, MemoryTypedStorageStore } from "../../../../../z_infra/storage/memory"

import { AuthCredentialStorage } from "../../../../login/renew/impl/repository/authCredential"

import { Clock } from "../../../../../z_infra/clock/infra"
import { ApplicationActionConfig } from "../../../../common/application/infra"
import {
    RenewActionConfig,
    RenewRemoteAccess,
    SetContinuousRenewActionConfig,
} from "../../../../login/renew/infra"
import { LoginRemoteAccess, PasswordLoginActionConfig } from "../../../../login/passwordLogin/infra"
import {
    GetStatusRemoteAccess,
    PasswordResetActionConfig,
    PasswordResetSessionActionConfig,
    ResetRemoteAccess,
    SendTokenRemoteAccess,
    StartSessionRemoteAccess,
} from "../../../../profile/passwordReset/infra"
import { AuthCredentialRepository } from "../../../../login/renew/infra"

import { ApplicationAction } from "../../../../common/application/action"
import { RenewAction, SetContinuousRenewAction } from "../../../../login/renew/action"
import { PasswordLoginAction } from "../../../../login/passwordLogin/action"
import { PasswordResetAction, PasswordResetSessionAction } from "../../../../profile/passwordReset/action"

import { ApiCredential, AuthAt, TicketNonce } from "../../../../common/credential/data"

export function initTestApplicationAction(config: ApplicationActionConfig): ApplicationAction {
    return {
        secureScriptPath: secureScriptPath({ config: config.secureScriptPath }),
    }
}
export function initTestRenewAction(
    config: RenewActionConfig,
    authCredentials: AuthCredentialRepository,
    remote: RenewRemoteAccess,
    clock: Clock
): RenewAction {
    const infra = {
        authCredentials,
        renew: remote,
        config: config.renew,
        delayed,
        clock,
    }

    return {
        renew: renew(infra),
        forceRenew: forceRenew(infra),
    }
}
export function initTestSetContinuousRenewAction(
    config: SetContinuousRenewActionConfig,
    authCredentials: AuthCredentialRepository,
    remote: RenewRemoteAccess,
    clock: Clock
): SetContinuousRenewAction {
    return {
        setContinuousRenew: setContinuousRenew({
            authCredentials,
            renew: remote,
            config: config.setContinuousRenew,
            clock,
        }),
    }
}
export function initTestPasswordLoginAction(
    config: PasswordLoginActionConfig,
    access: LoginRemoteAccess
): PasswordLoginAction {
    return {
        login: login({
            login: access,
            config: config.login,
            delayed,
        }),
    }
}
export function initTestPasswordResetSessionAction(
    config: PasswordResetSessionActionConfig,
    remote: Readonly<{
        startSession: StartSessionRemoteAccess
        sendToken: SendTokenRemoteAccess
        getStatus: GetStatusRemoteAccess
    }>
): PasswordResetSessionAction {
    return {
        startSession: startSession({
            startSession: remote.startSession,
            config: config.startSession,
            delayed,
        }),
        checkStatus: checkStatus({
            sendToken: remote.sendToken,
            getStatus: remote.getStatus,
            config: config.checkStatus,
            delayed,
            wait,
        }),
    }
}
export function initTestPasswordResetAction(
    config: PasswordResetActionConfig,
    remote: ResetRemoteAccess
): PasswordResetAction {
    return {
        reset: reset({
            reset: remote,
            config: config.reset,
            delayed,
        }),
    }
}

export function initLoginViewLocationInfo(currentURL: URL): LoginViewLocationInfo {
    return {
        login: {
            getLoginView: () => detectViewState(currentURL),
        },
    }
}
export function initRenewCredentialLocationInfo(currentURL: URL): RenewCredentialLocationInfo {
    return {
        application: initApplicationLocationInfo(currentURL),
    }
}
export function initPasswordLoginLocationInfo(currentURL: URL): PasswordLoginLocationInfo {
    return {
        application: initApplicationLocationInfo(currentURL),
    }
}
export function initPasswordResetLocationInfo(currentURL: URL): PasswordResetLocationInfo {
    return {
        application: initApplicationLocationInfo(currentURL),
        passwordReset: {
            getResetToken: () => detectResetToken(currentURL),
        },
    }
}
function initApplicationLocationInfo(currentURL: URL) {
    return {
        getPagePathname: () => currentPagePathname(currentURL),
    }
}

export type AuthCredentialStorageTestParam = Readonly<{
    ticketNonce: MemoryTypedStorageStore<TicketNonce>
    apiCredential: MemoryTypedStorageStore<ApiCredential>
    lastAuthAt: MemoryTypedStorageStore<AuthAt>
}>
export function initTestAuthCredentialStorage(
    params: AuthCredentialStorageTestParam
): AuthCredentialStorage {
    return {
        ticketNonce: initMemoryTypedStorage(params.ticketNonce),
        apiCredential: initMemoryTypedStorage(params.apiCredential),
        lastAuthAt: initMemoryTypedStorage(params.lastAuthAt),
    }
}
