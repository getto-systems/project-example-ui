import { delayed, wait } from "../../../../z_external/delayed"

import { LoginViewCollector } from "../impl/core"
import { currentPagePathname, detectResetToken, detectViewState } from "../impl/location"
import { PasswordLoginCollector, PasswordResetCollector, RenewCredentialCollector } from "../impl/core"

import { secureScriptPath } from "../../../common/application/impl/core"
import { forceRenew, renew, setContinuousRenew } from "../../../login/renew/impl/core"
import { login } from "../../../login/passwordLogin/impl/core"
import { startSession, checkStatus, reset } from "../../../profile/passwordReset/impl/core"

import { initSimulateRenewClient, RenewSimulator } from "../../../login/renew/impl/client/renew/simulate"
import {
    initSimulatePasswordLoginClient,
    LoginSimulator,
} from "../../../login/passwordLogin/impl/client/login/simulate"
import {
    initSimulatePasswordResetClient,
    ResetSimulator,
} from "../../../profile/passwordReset/impl/client/reset/simulate"
import {
    initSimulatePasswordResetSessionClient,
    SessionSimulator,
} from "../../../profile/passwordReset/impl/client/session/simulate"

import { ApplicationAction } from "../../../common/application/action"
import { RenewAction, SetContinuousRenewAction } from "../../../login/renew/action"
import { PasswordLoginAction } from "../../../login/passwordLogin/action"
import { PasswordResetAction, PasswordResetSessionAction } from "../../../profile/passwordReset/action"

import { ApplicationActionConfig } from "../../../common/application/infra"
import { Clock, RenewActionConfig, SetContinuousRenewActionConfig } from "../../../login/renew/infra"
import { PasswordLoginActionConfig } from "../../../login/passwordLogin/infra"
import {
    PasswordResetActionConfig,
    PasswordResetSessionActionConfig,
} from "../../../profile/passwordReset/infra"
import { AuthCredentialRepository } from "../../../login/renew/infra"

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
    const client = initSimulateRenewClient(simulator)
    const infra = {
        authCredentials,
        client,
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
            client,
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
            client: initSimulatePasswordLoginClient(simulator),
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
            client: sessionClient,
            config: config.startSession,
            delayed,
        }),
        checkStatus: checkStatus({
            client: sessionClient,
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
