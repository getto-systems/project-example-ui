import { delayed, wait } from "../../../../z_infra/delayed/core"

import { LoginViewCollector } from "../impl/core"
import { currentPagePathname, detectResetToken, detectViewState } from "../impl/location"

import { RenewCredentialCollector } from "../impl/renew"
import { PasswordLoginCollector } from "../impl/login"
import { PasswordResetCollector } from "../impl/reset"

import { secureScriptPath } from "../../../common/application/impl/core"
import { forceRenew, renew, setContinuousRenew } from "../../../login/renew/impl/core"
import { login } from "../../../login/passwordLogin/impl/core"
import { startSession, checkStatus, reset } from "../../../profile/passwordReset/impl/core"

import { initMemoryTypedStorage, MemoryTypedStorageStore } from "../../../../z_infra/storage/memory"

import { initSimulateRenewClient, RenewSimulator } from "../../../login/renew/impl/remote/renew/simulate"
import {
    initSimulatePasswordLoginClient,
    LoginSimulator,
} from "../../../login/passwordLogin/impl/remote/login/simulate"
import {
    initSimulatePasswordResetClient,
    ResetSimulator,
} from "../../../profile/passwordReset/impl/remote/reset/simulate"
import {
    initSimulatePasswordResetSessionClient,
    SessionSimulator,
} from "../../../profile/passwordReset/impl/remote/session/simulate"

import { AuthCredentialStorage } from "../../../login/renew/impl/repository/authCredential"

import { Clock } from "../../../../z_infra/clock/infra"
import { ApplicationActionConfig } from "../../../common/application/infra"
import { RenewActionConfig, SetContinuousRenewActionConfig } from "../../../login/renew/infra"
import { PasswordLoginActionConfig } from "../../../login/passwordLogin/infra"
import {
    PasswordResetActionConfig,
    PasswordResetSessionActionConfig,
} from "../../../profile/passwordReset/infra"
import { AuthCredentialRepository } from "../../../login/renew/infra"

import { ApplicationAction } from "../../../common/application/action"
import { RenewAction, SetContinuousRenewAction } from "../../../login/renew/action"
import { PasswordLoginAction } from "../../../login/passwordLogin/action"
import { PasswordResetAction, PasswordResetSessionAction } from "../../../profile/passwordReset/action"

import { ApiCredential, AuthAt, TicketNonce } from "../../../common/credential/data"

export function initApplicationAction(config: ApplicationActionConfig): ApplicationAction {
    return {
        secureScriptPath: secureScriptPath({ config: config.secureScriptPath }),
    }
}
export function initRenewAction(
    config: RenewActionConfig,
    authCredentials: AuthCredentialRepository,
    simulator: RenewSimulator,
    clock: Clock
): RenewAction {
    const infra = {
        authCredentials,
        renew: initSimulateRenewClient(simulator),
        config: config.renew,
        delayed,
        clock,
    }

    return {
        renew: renew(infra),
        forceRenew: forceRenew(infra),
    }
}
export function initSetContinuousRenewAction(
    config: SetContinuousRenewActionConfig,
    authCredentials: AuthCredentialRepository,
    simulator: RenewSimulator,
    clock: Clock
): SetContinuousRenewAction {
    const client = initSimulateRenewClient(simulator)

    return {
        setContinuousRenew: setContinuousRenew({
            authCredentials,
            renew: client,
            config: config.setContinuousRenew,
            clock,
        }),
    }
}
export function initPasswordLoginAction(
    config: PasswordLoginActionConfig,
    simulator: LoginSimulator
): PasswordLoginAction {
    return {
        login: login({
            login: initSimulatePasswordLoginClient(simulator),
            config: config.login,
            delayed,
        }),
    }
}
export function initPasswordResetSessionAction(
    config: PasswordResetSessionActionConfig,
    simulator: SessionSimulator
): PasswordResetSessionAction {
    const sessionClient = initSimulatePasswordResetSessionClient(simulator)

    return {
        startSession: startSession({
            resetSession: sessionClient,
            config: config.startSession,
            delayed,
        }),
        checkStatus: checkStatus({
            reset: sessionClient,
            config: config.checkStatus,
            delayed,
            wait,
        }),
    }
}
export function initPasswordResetAction(
    config: PasswordResetActionConfig,
    simulator: ResetSimulator
): PasswordResetAction {
    const resetClient = initSimulatePasswordResetClient(simulator)

    return {
        reset: reset({
            client: resetClient,
            config: config.reset,
            delayed,
        }),
    }
}

export function initLoginViewCollector(currentURL: URL): LoginViewCollector {
    return {
        login: {
            getLoginView: () => detectViewState(currentURL),
        },
    }
}
export function initRenewCredentialCollector(currentURL: URL): RenewCredentialCollector {
    return {
        application: initApplicationCollector(currentURL),
    }
}
export function initPasswordLoginCollector(currentURL: URL): PasswordLoginCollector {
    return {
        application: initApplicationCollector(currentURL),
    }
}
export function initPasswordResetCollector(currentURL: URL): PasswordResetCollector {
    return {
        application: initApplicationCollector(currentURL),
        passwordReset: {
            getResetToken: () => detectResetToken(currentURL),
        },
    }
}
function initApplicationCollector(currentURL: URL) {
    return {
        getPagePathname: () => currentPagePathname(currentURL),
    }
}

export type AuthCredentialTestStorageParam = Readonly<{
    ticketNonce: MemoryTypedStorageStore<TicketNonce>
    apiCredential: MemoryTypedStorageStore<ApiCredential>
    lastAuthAt: MemoryTypedStorageStore<AuthAt>
}>
export function initAuthCredentialTestStorage(
    params: AuthCredentialTestStorageParam
): AuthCredentialStorage {
    return {
        ticketNonce: initMemoryTypedStorage(params.ticketNonce),
        apiCredential: initMemoryTypedStorage(params.apiCredential),
        lastAuthAt: initMemoryTypedStorage(params.lastAuthAt),
    }
}
