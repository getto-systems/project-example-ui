import { delayed, wait } from "../../../../../z_external/delayed"
import { initAuthClient, AuthClient } from "../../../../../z_external/auth_client/auth_client"

import { env } from "../../../../../y_static/env"

import {
    newPasswordLoginActionConfig,
    newPasswordResetActionConfig,
    newPasswordResetSessionActionConfig,
} from "../../impl/config"

import { initLoginWorkerAsBackground, Material } from "../../impl/worker/background"

import { login } from "../../../../login/password_login/impl/core"
import { startSession, checkStatus, reset } from "../../../../profile/password_reset/impl/core"

import { initFetchPasswordLoginClient } from "../../../../login/password_login/impl/client/login/fetch"
import { initSimulatePasswordResetClient } from "../../../../profile/password_reset/impl/client/reset/simulate"
import { initSimulatePasswordResetSessionClient } from "../../../../profile/password_reset/impl/client/session/simulate"

import { PasswordLoginActionConfig } from "../../../../login/password_login/infra"
import {
    PasswordResetActionConfig,
    PasswordResetSessionActionConfig,
} from "../../../../profile/password_reset/infra"

import { PasswordLoginAction } from "../../../../login/password_login/action"
import {
    PasswordResetAction,
    PasswordResetSessionAction,
} from "../../../../profile/password_reset/action"

import { markTicketNonce, markLoginAt, markApiCredential } from "../../../../common/credential/data"
import { markSessionID } from "../../../../profile/password_reset/data"

export function initLoginWorker(worker: Worker): void {
    const authClient = initAuthClient(env.authServerURL)

    const material: Material = {
        passwordLogin: initPasswordLoginAction(newPasswordLoginActionConfig(), authClient),
        passwordResetSession: initPasswordResetSessionAction(newPasswordResetSessionActionConfig()),
        passwordReset: initPasswordResetAction(newPasswordResetActionConfig()),
    }

    return initLoginWorkerAsBackground(material, worker)
}

export function initPasswordLoginAction(
    config: PasswordLoginActionConfig,
    authClient: AuthClient
): PasswordLoginAction {
    return {
        login: login({
            client: initFetchPasswordLoginClient(authClient),
            config: config.login,
            delayed,
        }),
    }
}
export function initPasswordResetSessionAction(
    config: PasswordResetSessionActionConfig
): PasswordResetSessionAction {
    const targetLoginID = "loginID"
    const targetSessionID = markSessionID("session-id")

    const sessionClient = initSimulatePasswordResetSessionClient({
        // エラーにする場合は StartSessionError を throw (それ以外を throw するとこわれる)
        async startSession({ loginID }) {
            if (loginID !== targetLoginID) {
                throw { type: "invalid-password-reset" }
            }
            return targetSessionID
        },
        // エラーにする場合は CheckStatusError を throw (それ以外を throw するとこわれる)
        async sendToken(post) {
            setTimeout(() => post({ state: "waiting" }), 0.3 * 1000)
            setTimeout(() => post({ state: "sending" }), 0.6 * 1000)
            setTimeout(() => post({ state: "success" }), 0.9 * 1000)
            return true
        },
        // エラーにする場合は CheckStatusError を throw (それ以外を throw するとこわれる)
        async getDestination(sessionID) {
            if (sessionID != targetSessionID) {
                throw { type: "invalid-password-reset" }
            }
            return { type: "log" }
        },
    })

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
export function initPasswordResetAction(config: PasswordResetActionConfig): PasswordResetAction {
    const targetLoginID = "loginID"
    const targetResetToken = "reset-token"

    const resetClient = initSimulatePasswordResetClient({
        // エラーにする場合は ResetError を throw (それ以外を throw するとこわれる)
        async reset(resetToken, { loginID }) {
            if (resetToken !== targetResetToken) {
                throw { type: "invalid-password-reset" }
            }
            if (loginID !== targetLoginID) {
                throw { type: "invalid-password-reset" }
            }
            return {
                ticketNonce: markTicketNonce("ticket-nonce"),
                apiCredential: markApiCredential({
                    apiRoles: ["admin", "dev"],
                }),
                loginAt: markLoginAt(new Date()),
            }
        },
    })

    return {
        reset: reset({
            client: resetClient,
            config: config.reset,
            delayed,
        }),
    }
}
