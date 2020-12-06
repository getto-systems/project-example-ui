import { delayed, wait } from "../../../../z_external/delayed"

import { LoginViewCollector } from "../impl/view"
import { currentPagePathname, detectResetToken, detectViewState } from "../impl/location"
import { PasswordLoginCollector, PasswordResetCollector, RenewCredentialCollector } from "../impl/core"

import { secureScriptPath } from "../../../common/application/impl/core"
import {
    loadLastLogin,
    removeAuthCredential,
    storeAuthCredential,
} from "../../../common/credential/impl/core"
import { renew, setContinuousRenew } from "../../../login/renew/impl/core"
import { login } from "../../../login/password_login/impl/core"
import { startSession, checkStatus, reset } from "../../../profile/password_reset/impl/core"

import { initSimulateRenewClient, RenewSimulator } from "../../../login/renew/impl/client/renew/simulate"
import { initAuthExpires } from "../../../login/renew/impl/expires"
import { initRenewRunner } from "../../../login/renew/impl/renew_runner"
import {
    initSimulatePasswordLoginClient,
    LoginSimulator,
} from "../../../login/password_login/impl/client/login/simulate"
import {
    initSimulatePasswordResetClient,
    ResetSimulator,
} from "../../../profile/password_reset/impl/client/reset/simulate"
import {
    initSimulatePasswordResetSessionClient,
    SessionSimulator,
} from "../../../profile/password_reset/impl/client/session/simulate"

import { ApplicationAction } from "../../../common/application/action"
import { CredentialAction } from "../../../common/credential/action"
import { RenewAction } from "../../../login/renew/action"
import { PasswordLoginAction } from "../../../login/password_login/action"
import { PasswordResetAction, PasswordResetSessionAction } from "../../../profile/password_reset/action"

import { SecureScriptPathHostConfig } from "../../../common/application/infra"
import { RenewTimeConfig, SetContinuousRenewTimeConfig } from "../../../login/renew/infra"
import { LoginTimeConfig } from "../../../login/password_login/infra"
import {
    CheckStatusTimeConfig,
    ResetTimeConfig,
    StartSessionTimeConfig,
} from "../../../profile/password_reset/infra"
import { AuthCredentialRepository } from "../../../common/credential/infra"

export function initApplicationAction(host: {
    secureScriptPath: SecureScriptPathHostConfig
}): ApplicationAction {
    return {
        secureScriptPath: secureScriptPath({ host: host.secureScriptPath }),
    }
}
export function initCredentialAction(
    time: { renew: RenewTimeConfig; setContinuousRenew: SetContinuousRenewTimeConfig },
    repository: { authCredentials: AuthCredentialRepository },
    simulator: RenewSimulator
): RenewAction & CredentialAction {
    const client = initSimulateRenewClient(simulator)
    const { authCredentials } = repository

    return {
        renew: renew({
            client,
            time: time.renew,
            delayed,
            expires: initAuthExpires(),
        }),
        setContinuousRenew: setContinuousRenew({
            client,
            time: time.setContinuousRenew,
            runner: initRenewRunner(),
        }),
        storeAuthCredential: storeAuthCredential({ authCredentials }),
        removeAuthCredential: removeAuthCredential({ authCredentials }),
        loadLastLogin: loadLastLogin({ authCredentials }),
    }
}
export function initPasswordLoginAction(
    time: { login: LoginTimeConfig },
    simulator: LoginSimulator
): PasswordLoginAction {
    return {
        login: login({
            client: initSimulatePasswordLoginClient(simulator),
            time: time.login,
            delayed,
        }),
    }
}
export function initPasswordResetAction(
    time: {
        startSession: StartSessionTimeConfig
        checkStatus: CheckStatusTimeConfig
        reset: ResetTimeConfig
    },
    simulator: SessionSimulator & ResetSimulator
): PasswordResetAction & PasswordResetSessionAction {
    const sessionClient = initSimulatePasswordResetSessionClient(simulator)
    const resetClient = initSimulatePasswordResetClient(simulator)

    return {
        startSession: startSession({
            client: sessionClient,
            time: time.startSession,
            delayed,
        }),
        checkStatus: checkStatus({
            client: sessionClient,
            time: time.checkStatus,
            delayed,
            wait,
        }),
        reset: reset({
            client: resetClient,
            time: time.reset,
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
