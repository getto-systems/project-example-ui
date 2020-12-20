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
import { CredentialAction, StoreCredentialAction } from "../../../common/credential/action"
import { RenewAction, SetContinuousRenewAction } from "../../../login/renew/action"
import { PasswordLoginAction } from "../../../login/password_login/action"
import { PasswordResetAction, PasswordResetSessionAction } from "../../../profile/password_reset/action"

import { ApplicationActionConfig } from "../../../common/application/infra"
import { RenewActionConfig, SetContinuousRenewActionConfig } from "../../../login/renew/infra"
import { PasswordLoginActionConfig } from "../../../login/password_login/infra"
import {
    PasswordResetActionConfig,
    PasswordResetSessionActionConfig,
} from "../../../profile/password_reset/infra"
import { AuthCredentialRepository } from "../../../common/credential/infra"

export function initApplicationAction(config: ApplicationActionConfig): ApplicationAction {
    return {
        secureScriptPath: secureScriptPath({ config: config.secureScriptPath }),
    }
}
export function initStoreCredentialAction(
    authCredentials: AuthCredentialRepository
): StoreCredentialAction {
    return {
        storeAuthCredential: storeAuthCredential({ authCredentials }),
    }
}
export function initCredentialAction(authCredentials: AuthCredentialRepository): CredentialAction {
    return {
        removeAuthCredential: removeAuthCredential({ authCredentials }),
        loadLastLogin: loadLastLogin({ authCredentials }),
    }
}
export function initRenewAction(config: RenewActionConfig, simulator: RenewSimulator): RenewAction {
    const client = initSimulateRenewClient(simulator)

    return {
        renew: renew({
            client,
            config: config.renew,
            delayed,
            expires: initAuthExpires(),
        }),
    }
}
export function initSetContinuousRenewAction(
    config: SetContinuousRenewActionConfig,
    simulator: RenewSimulator
): SetContinuousRenewAction {
    const client = initSimulateRenewClient(simulator)

    return {
        setContinuousRenew: setContinuousRenew({
            client,
            config: config.setContinuousRenew,
            runner: initRenewRunner(),
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
