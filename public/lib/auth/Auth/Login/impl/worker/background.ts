import {
    ForegroundMessage,
    BackgroundMessage,
    ProxyMessage,
    ProxyResponse,
    LoginProxyMessage,
    StartSessionProxyMessage,
    CheckStatusProxyMessage,
    ResetProxyMessage,
} from "./data"

import { LoginPod, PasswordLoginAction } from "../../../../login/password_login/action"
import {
    PasswordResetAction,
    PasswordResetSessionAction,
    StartSessionPod,
    CheckStatusPod,
    ResetPod,
} from "../../../../profile/password_reset/action"

import { LoginEvent } from "../../../../login/password_login/data"
import { CheckStatusEvent, ResetEvent, StartSessionEvent } from "../../../../profile/password_reset/data"

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

export type Material = Readonly<{
    passwordLogin: PasswordLoginAction
    passwordResetSession: PasswordResetSessionAction
    passwordReset: PasswordResetAction
}>

export function initLoginWorkerAsBackground(material: Material, worker: Worker): void {
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
