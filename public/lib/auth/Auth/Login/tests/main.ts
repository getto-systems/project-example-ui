import { delayed, wait } from "../../../../z_external/delayed"

import { TimeConfig, HostConfig } from "../impl/config"

import { initLoginAsSingle } from "../impl/single"

import { initLoginLink } from "../impl/link"

import { initRenewCredential } from "../../renew_credential/impl"
import { initPasswordLogin } from "../../password_login/impl"
import { initPasswordResetSession } from "../../password_reset_session/impl"
import { initPasswordReset } from "../../password_reset/impl"

import { initLoginIDField } from "../../field/login_id/impl"
import { initPasswordField } from "../../field/password/impl"

import { secureScriptPath } from "../../../common/application/impl/core"
import { renew, setContinuousRenew, store } from "../../../login/renew/impl/core"
import { login } from "../../../login/password_login/impl/core"
import { startSession, checkStatus, reset } from "../../../profile/password_reset/impl/core"

import { loginIDField } from "../../../common/field/login_id/impl/core"
import { passwordField } from "../../../common/field/password/impl/core"

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

import { currentPagePathname, detectViewState, detectResetToken } from "../impl/location"

import { LoginFactory } from "../view"
import { AuthCredentialRepository } from "../../../login/renew/infra"

type Config = {
    time: TimeConfig
    host: HostConfig
}
type Repository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
type Simulator = LoginSimulator & RenewSimulator & SessionSimulator & ResetSimulator

export function newLogin(
    currentURL: URL,
    config: Config,
    repository: Repository,
    simulator: Simulator
): LoginFactory {
    const factory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(config.host),
            credential: initCredentialAction(config.time, repository.authCredentials, simulator),

            passwordLogin: initPasswordLoginAction(config.time, simulator),
            passwordReset: initPasswordResetAction(config.time, simulator),

            field: {
                loginID: loginIDField,
                password: passwordField,
            },
        },
        components: {
            renewCredential: initRenewCredential,

            passwordLogin: initPasswordLogin,
            passwordResetSession: initPasswordResetSession,
            passwordReset: initPasswordReset,

            field: {
                loginID: initLoginIDField,
                password: initPasswordField,
            },
        },
    }
    const collector = {
        login: {
            getLoginView: () => detectViewState(currentURL),
        },
        application: {
            getPagePathname: () => currentPagePathname(currentURL),
        },
        passwordReset: {
            getResetToken: () => detectResetToken(currentURL),
        },
    }

    return () => initLoginAsSingle(factory, collector)
}

function initApplicationAction(host: HostConfig) {
    return {
        secureScriptPath: secureScriptPath({ host }),
    }
}
function initCredentialAction(
    time: TimeConfig,
    authCredentials: AuthCredentialRepository,
    simulator: RenewSimulator
) {
    const client = initSimulateRenewClient(simulator)

    return {
        renew: renew({
            authCredentials,
            client,
            time,
            delayed,
            expires: initAuthExpires(),
        }),
        setContinuousRenew: setContinuousRenew({
            authCredentials,
            client,
            time,
            runner: initRenewRunner(),
        }),
        store: store({ authCredentials }),
    }
}
function initPasswordLoginAction(time: TimeConfig, simulator: LoginSimulator) {
    return {
        login: login({
            client: initSimulatePasswordLoginClient(simulator),
            time,
            delayed,
        }),
    }
}
function initPasswordResetAction(time: TimeConfig, simulator: SessionSimulator & ResetSimulator) {
    const sessionClient = initSimulatePasswordResetSessionClient(simulator)
    const resetClient = initSimulatePasswordResetClient(simulator)

    return {
        startSession: startSession({
            client: sessionClient,
            time,
            delayed,
        }),
        checkStatus: checkStatus({
            client: sessionClient,
            time,
            delayed,
            wait,
        }),
        reset: reset({
            client: resetClient,
            time,
            delayed,
        }),
    }
}
