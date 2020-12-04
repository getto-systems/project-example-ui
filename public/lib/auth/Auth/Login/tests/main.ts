import { delayed, wait } from "../../../../z_external/delayed"

import { TimeConfig, newHostConfig } from "../impl/config"

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
import { initMemoryAuthCredentialRepository } from "../../../login/renew/impl/repository/auth_credential/memory"
import {
    initSimulatePasswordLoginClient,
    LoginSimulator,
} from "../../../login/password_login/impl/client/login/simulate"
import { initSimulatePasswordResetClient, ResetSimulator } from "../../../profile/password_reset/impl/client/reset/simulate"
import { initSimulatePasswordResetSessionClient, SessionSimulator } from "../../../profile/password_reset/impl/client/session/simulate"

import { currentPagePathname, detectViewState, detectResetToken } from "../impl/location"

import { LoginFactory } from "../view"

type Simulator = LoginSimulator & RenewSimulator & SessionSimulator & ResetSimulator

export function newLogin(currentURL: URL, time: TimeConfig, simulator: Simulator): LoginFactory {
    const factory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(),
            credential: initCredentialAction(time, simulator),

            passwordLogin: initPasswordLoginAction(time, simulator),
            passwordReset: initPasswordResetAction(time, simulator),

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

function initApplicationAction() {
    return {
        secureScriptPath: secureScriptPath({ host: newHostConfig() }),
    }
}
function initCredentialAction(time: TimeConfig, simulator: RenewSimulator) {
    const authCredentials = initMemoryAuthCredentialRepository()
    const client = initSimulateRenewClient(simulator)

    return {
        renew: renew({
            time,

            authCredentials,
            client,
            delayed,

            expires: initAuthExpires(),
        }),
        setContinuousRenew: setContinuousRenew({
            time,

            authCredentials,
            client,

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
