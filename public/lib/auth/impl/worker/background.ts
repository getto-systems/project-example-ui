import {
    ForegroundMessage,
    BackgroundMessage,
    ProxyMessage,
    ProxyResponse,
    LoginProxyMessage,
    StartSessionProxyMessage,
    PollingStatusProxyMessage,
    ResetProxyMessage,
} from "./data"

import { Login } from "../../../password_login/action"
import { StartSession, PollingStatusAction, Reset } from "../../../password_reset/action"

import { LoginEvent } from "../../../password_login/data"
import { PollingStatusEvent, ResetEvent, StartSessionEvent } from "../../../password_reset/data"

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
            this.post({ handlerID, done: true, response: event })
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
            this.post({ handlerID, done: true, response: event })
        })
    }
}
class PollingStatusHandler {
    pollingStatus: PollingStatusAction
    post: Post<ProxyResponse<PollingStatusEvent>>

    constructor(pollingStatus: PollingStatusAction, post: Post<ProxyResponse<PollingStatusEvent>>) {
        this.pollingStatus = pollingStatus
        this.post = post
    }

    handleMessage({ handlerID, message: { sessionID } }: ProxyMessage<PollingStatusProxyMessage>): void {
        this.pollingStatus(sessionID, (event) => {
            this.post({ handlerID, done: hasDone(), response: event })

            function hasDone() {
                switch (event.type) {
                    case "retry-to-polling-status":
                    case "try-to-polling-status":
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
            this.post({ handlerID, done: true, response: event })
        })
    }
}

export type ActionSet = Readonly<{
    passwordLogin: Readonly<{
        login: Login
    }>
    passwordReset: Readonly<{
        startSession: StartSession
        pollingStatus: PollingStatusAction
        reset: Reset
    }>
}>

export function initAuthWorkerAsBackground(actions: ActionSet, worker: Worker): void {
    const handlers = initAuthHandlerSet(actions, postBackgroundMessage)
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
type AuthHandlerSet = Readonly<{
    passwordLogin: Readonly<{
        login: LoginHandler
    }>
    passwordReset: Readonly<{
        startSession: StartSessionHandler
        pollingStatus: PollingStatusHandler
        reset: ResetHandler
    }>
}>
function initAuthHandlerSet(
    actions: ActionSet,
    postBackgroundMessage: Post<BackgroundMessage>
): AuthHandlerSet {
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
            pollingStatus: new PollingStatusHandler(actions.passwordReset.pollingStatus, (response) => {
                postBackgroundMessage({ type: "pollingStatus", response })
            }),
            reset: new ResetHandler(actions.passwordReset.reset, (response) => {
                postBackgroundMessage({ type: "reset", response })
            }),
        },
    }
}
function initForegroundMessageHandler(
    handlers: AuthHandlerSet,
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

                case "pollingStatus":
                    handlers.passwordReset.pollingStatus.handleMessage(message.message)
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
