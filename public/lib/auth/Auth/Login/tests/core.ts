import { delayed, wait } from "../../../../z_external/delayed"

import { LoginViewCollector } from "../impl/view"
import { currentPagePathname, detectResetToken, detectViewState } from "../impl/location"
import { PasswordLoginCollector, PasswordResetCollector, RenewCredentialCollector } from "../impl/core"

import { secureScriptPath } from "../../../common/application/impl/core"
import { renew, setContinuousRenew, store } from "../../../login/renew/impl/core"
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

import { SecureScriptPath } from "../../../common/application/action"
import { Renew, SetContinuousRenew, Store } from "../../../login/renew/action"
import { Login } from "../../../login/password_login/action"
import { CheckStatus, Reset, StartSession } from "../../../profile/password_reset/action"

import { SecureScriptPathHostConfig } from "../../../common/application/infra"
import {
    AuthCredentialRepository,
    RenewTimeConfig,
    SetContinuousRenewTimeConfig,
} from "../../../login/renew/infra"
import { LoginTimeConfig } from "../../../login/password_login/infra"
import {
    CheckStatusTimeConfig,
    ResetTimeConfig,
    StartSessionTimeConfig,
} from "../../../profile/password_reset/infra"

export function initApplicationAction(host: {
    secureScriptPath: SecureScriptPathHostConfig
}): { secureScriptPath: SecureScriptPath } {
    return {
        secureScriptPath: secureScriptPath({ host: host.secureScriptPath }),
    }
}
export function initCredentialAction(
    time: { renew: RenewTimeConfig; setContinuousRenew: SetContinuousRenewTimeConfig },
    repository: { authCredentials: AuthCredentialRepository },
    simulator: RenewSimulator
): { renew: Renew; setContinuousRenew: SetContinuousRenew; store: Store } {
    const client = initSimulateRenewClient(simulator)
    const { authCredentials } = repository

    return {
        renew: renew({
            authCredentials,
            client,
            time: time.renew,
            delayed,
            expires: initAuthExpires(),
        }),
        setContinuousRenew: setContinuousRenew({
            authCredentials,
            client,
            time: time.setContinuousRenew,
            runner: initRenewRunner(),
        }),
        store: store({ authCredentials }),
    }
}
export function initPasswordLoginAction(
    time: { login: LoginTimeConfig },
    simulator: LoginSimulator
): { login: Login } {
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
): { startSession: StartSession; checkStatus: CheckStatus; reset: Reset } {
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
