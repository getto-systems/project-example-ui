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

import { Login } from "../../../../password_login/action"
import { StartSession, CheckStatusAction, Reset } from "../../../../password_reset/action"

import { LoginEvent } from "../../../../password_login/data"
import { CheckStatusEvent, ResetEvent, StartSessionEvent } from "../../../../password_reset/data"

class LoginHandler {
    login: Login
    post: Post<ProxyResponse<LoginEvent>>

    constructor(login: Login, post: Post<ProxyResponse<LoginEvent>>) {
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
    startSession: StartSession
    post: Post<ProxyResponse<StartSessionEvent>>

    constructor(startSession: StartSession, post: Post<ProxyResponse<StartSessionEvent>>) {
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
    checkStatus: CheckStatusAction
    post: Post<ProxyResponse<CheckStatusEvent>>

    constructor(checkStatus: CheckStatusAction, post: Post<ProxyResponse<CheckStatusEvent>>) {
        this.checkStatus = checkStatus
        this.post = post
    }

    handleMessage({ handlerID, message: { sessionID } }: ProxyMessage<CheckStatusProxyMessage>): void {
        this.checkStatus(sessionID, (event) => {
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
    reset: Reset
    post: Post<ProxyResponse<ResetEvent>>

    constructor(reset: Reset, post: Post<ProxyResponse<ResetEvent>>) {
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

export type ActionSet = Readonly<{
    passwordLogin: Readonly<{
        login: Login
    }>
    passwordReset: Readonly<{
        startSession: StartSession
        checkStatus: CheckStatusAction
        reset: Reset
    }>
}>

export function initLoginWorkerAsBackground(actions: ActionSet, worker: Worker): void {
    const handlers = initLoginHandlerSet(actions, postBackgroundMessage)
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
type LoginHandlerSet = Readonly<{
    passwordLogin: Readonly<{
        login: LoginHandler
    }>
    passwordReset: Readonly<{
        startSession: StartSessionHandler
        checkStatus: CheckStatusHandler
        reset: ResetHandler
    }>
}>
function initLoginHandlerSet(
    actions: ActionSet,
    postBackgroundMessage: Post<BackgroundMessage>
): LoginHandlerSet {
    return {
        passwordLogin: {
            login: new LoginHandler(actions.passwordLogin.login, (response) => {
                postBackgroundMessage({ type: "login", response })
            }),
        },
        passwordReset: {
            startSession: new StartSessionHandler(actions.passwordReset.startSession, (response) => {
                postBackgroundMessage({ type: "startSession", response })
            }),
            checkStatus: new CheckStatusHandler(actions.passwordReset.checkStatus, (response) => {
                postBackgroundMessage({ type: "checkStatus", response })
            }),
            reset: new ResetHandler(actions.passwordReset.reset, (response) => {
                postBackgroundMessage({ type: "reset", response })
            }),
        },
    }
}
function initForegroundMessageHandler(
    handlers: LoginHandlerSet,
    errorHandler: Post<string>
): Post<ForegroundMessage> {
    return (message) => {
        try {
            switch (message.type) {
                case "login":
                    handlers.passwordLogin.login.handleMessage(message.message)
                    break

                case "startSession":
                    handlers.passwordReset.startSession.handleMessage(message.message)
                    break

                case "checkStatus":
                    handlers.passwordReset.checkStatus.handleMessage(message.message)
                    break

                case "reset":
                    handlers.passwordReset.reset.handleMessage(message.message)
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
