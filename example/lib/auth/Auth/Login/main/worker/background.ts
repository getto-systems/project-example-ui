import { delayed, wait } from "../../../../../z_infra/delayed/core"
import { initAuthClient, AuthClient } from "../../../../../z_external/authClient/authClient"

import { env } from "../../../../../y_environment/env"

import {
    newPasswordLoginActionConfig,
    newPasswordResetActionConfig,
    newPasswordResetSessionActionConfig,
} from "../config"

import { login } from "../../../../login/passwordLogin/impl/core"
import { startSession, checkStatus, reset } from "../../../../profile/passwordReset/impl/core"

import { initFetchPasswordLoginClient } from "../../../../login/passwordLogin/impl/remote/login/fetch"
import { initSimulatePasswordResetClient } from "../../../../profile/passwordReset/impl/remote/reset/simulate"
import { initSimulatePasswordResetSessionClient } from "../../../../profile/passwordReset/impl/remote/session/simulate"

import { PasswordLoginActionConfig } from "../../../../login/passwordLogin/infra"
import {
    PasswordResetActionConfig,
    PasswordResetSessionActionConfig,
} from "../../../../profile/passwordReset/infra"

import { LoginPod, PasswordLoginAction } from "../../../../login/passwordLogin/action"
import {
    StartSessionPod,
    CheckStatusPod,
    ResetPod,
    PasswordResetAction,
    PasswordResetSessionAction,
} from "../../../../profile/passwordReset/action"

import { LoginEvent } from "../../../../login/passwordLogin/event"
import { CheckStatusEvent, ResetEvent, StartSessionEvent } from "../../../../profile/passwordReset/event"

import { markTicketNonce, markAuthAt, markApiCredential } from "../../../../common/credential/data"
import { markSessionID } from "../../../../profile/passwordReset/data"

import {
    ForegroundMessage,
    BackgroundMessage,
    ProxyMessage,
    ProxyResponse,
    LoginProxyMessage,
    StartSessionProxyMessage,
    CheckStatusProxyMessage,
    ResetProxyMessage,
} from "./message"

export function initLoginWorker(worker: Worker): void {
    const authClient = initAuthClient(env.authServerURL)

    const material: Material = {
        passwordLogin: initPasswordLoginAction(newPasswordLoginActionConfig(), authClient),
        passwordResetSession: initPasswordResetSessionAction(newPasswordResetSessionActionConfig()),
        passwordReset: initPasswordResetAction(newPasswordResetActionConfig()),
    }

    initLoginWorkerAsBackground(material, worker)
}

export function initPasswordLoginAction(
    config: PasswordLoginActionConfig,
    authClient: AuthClient
): PasswordLoginAction {
    return {
        login: login({
            login: initFetchPasswordLoginClient(authClient),
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
                authAt: markAuthAt(new Date()),
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

class LoginHandler {
    login: LoginPod
    post: Post<ProxyResponse<LoginEvent>>

    constructor(login: LoginPod, post: Post<ProxyResponse<LoginEvent>>) {
        this.login = login
        this.post = post
    }

    handleMessage({ handlerID, message: { content } }: ProxyMessage<LoginProxyMessage>): void {
        const collector = {
            getFields: () => Promise.resolve(content),
        }
        this.login(collector)((event) => {
            this.post({ handlerID, done: hasDone(), response: event })

            function hasDone() {
                switch (event.type) {
                    case "try-to-login":
                    case "delayed-to-login":
                        return false

                    default:
                        return true
                }
            }
        })
    }
}
class StartSessionHandler {
    startSession: StartSessionPod
    post: Post<ProxyResponse<StartSessionEvent>>

    constructor(startSession: StartSessionPod, post: Post<ProxyResponse<StartSessionEvent>>) {
        this.startSession = startSession
        this.post = post
    }

    handleMessage({ handlerID, message: { content } }: ProxyMessage<StartSessionProxyMessage>): void {
        const collector = {
            getFields: () => Promise.resolve(content),
        }
        this.startSession(collector)((event) => {
            this.post({ handlerID, done: hasDone(), response: event })

            function hasDone() {
                switch (event.type) {
                    case "try-to-start-session":
                    case "delayed-to-start-session":
                        return false

                    default:
                        return true
                }
            }
        })
    }
}
class CheckStatusHandler {
    checkStatus: CheckStatusPod
    post: Post<ProxyResponse<CheckStatusEvent>>

    constructor(checkStatus: CheckStatusPod, post: Post<ProxyResponse<CheckStatusEvent>>) {
        this.checkStatus = checkStatus
        this.post = post
    }

    handleMessage({ handlerID, message: { sessionID } }: ProxyMessage<CheckStatusProxyMessage>): void {
        this.checkStatus()(sessionID, (event) => {
            this.post({ handlerID, done: hasDone(), response: event })

            function hasDone() {
                switch (event.type) {
                    case "retry-to-check-status":
                    case "try-to-check-status":
                        return false

                    default:
                        return true
                }
            }
        })
    }
}
class ResetHandler {
    reset: ResetPod
    post: Post<ProxyResponse<ResetEvent>>

    constructor(reset: ResetPod, post: Post<ProxyResponse<ResetEvent>>) {
        this.reset = reset
        this.post = post
    }

    handleMessage({
        handlerID,
        message: { resetToken, content },
    }: ProxyMessage<ResetProxyMessage>): void {
        const collector = {
            getFields: () => Promise.resolve(content),
            getResetToken: () => resetToken,
        }
        this.reset(collector)((event) => {
            this.post({ handlerID, done: hasDone(), response: event })

            function hasDone() {
                switch (event.type) {
                    case "try-to-reset":
                    case "delayed-to-reset":
                        return false

                    default:
                        return true
                }
            }
        })
    }
}

type Material = Readonly<{
    passwordLogin: PasswordLoginAction
    passwordResetSession: PasswordResetSessionAction
    passwordReset: PasswordResetAction
}>

function initLoginWorkerAsBackground(material: Material, worker: Worker): void {
    const handlers = initHandler(material, postBackgroundMessage)
    const errorHandler = (err: string) => {
        postBackgroundMessage({ type: "error", err })
    }
    const messageHandler = initForegroundMessageHandler(handlers, errorHandler)

    worker.addEventListener("message", (event) => {
        messageHandler(event.data)
    })

    function postBackgroundMessage(message: BackgroundMessage) {
        worker.postMessage(message)
    }
}

type Handler = Readonly<{
    passwordLogin: Readonly<{
        login: LoginHandler
    }>
    passwordReset: Readonly<{
        startSession: StartSessionHandler
        checkStatus: CheckStatusHandler
        reset: ResetHandler
    }>
}>
function initHandler(material: Material, postBackgroundMessage: Post<BackgroundMessage>): Handler {
    return {
        passwordLogin: {
            login: new LoginHandler(material.passwordLogin.login, (response) => {
                postBackgroundMessage({ type: "login", response })
            }),
        },
        passwordReset: {
            startSession: new StartSessionHandler(
                material.passwordResetSession.startSession,
                (response) => {
                    postBackgroundMessage({ type: "startSession", response })
                }
            ),
            checkStatus: new CheckStatusHandler(
                material.passwordResetSession.checkStatus,
                (response) => {
                    postBackgroundMessage({ type: "checkStatus", response })
                }
            ),
            reset: new ResetHandler(material.passwordReset.reset, (response) => {
                postBackgroundMessage({ type: "reset", response })
            }),
        },
    }
}
function initForegroundMessageHandler(
    handler: Handler,
    errorHandler: Post<string>
): Post<ForegroundMessage> {
    return (message) => {
        try {
            switch (message.type) {
                case "login":
                    handler.passwordLogin.login.handleMessage(message.message)
                    break

                case "startSession":
                    handler.passwordReset.startSession.handleMessage(message.message)
                    break

                case "checkStatus":
                    handler.passwordReset.checkStatus.handleMessage(message.message)
                    break

                case "reset":
                    handler.passwordReset.reset.handleMessage(message.message)
                    break

                default:
                    assertNever(message)
            }
        } catch (err) {
            errorHandler(`${err}`)
        }
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
