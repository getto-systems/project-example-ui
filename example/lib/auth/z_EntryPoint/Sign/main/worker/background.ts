import {
    initPasswordResetAction,
    initPasswordResetSessionAction,
} from "../../../../sign/password/reset/register/main/reset"

import {
    StartSessionPod,
    CheckStatusPod,
    ResetPod,
    ResetAction,
    ResetSessionAction,
} from "../../../../sign/password/reset/register/action"

import {
    CheckStatusEvent,
    ResetEvent,
    StartSessionEvent,
} from "../../../../sign/password/reset/register/event"

import {
    ForegroundMessage,
    BackgroundMessage,
    ProxyMessage,
    ProxyResponse,
    StartSessionProxyMessage,
    CheckStatusProxyMessage,
    ResetProxyMessage,
} from "./message"
import { WorkerBackgroundHandler } from "../../../../../common/getto-worker/worker/background"
import { LoginActionProxyMessage } from "../../../../sign/password/login/worker/message"
import { newLoginActionBackgroundHandler } from "../../../../sign/password/login/worker/background"

export function initLoginWorker(worker: Worker): void {
    const material: Material = {
        resetSession: initPasswordResetSessionAction(),
        reset: initPasswordResetAction(),
    }

    initLoginWorkerAsBackground(material, worker)
}

class StartSessionHandler {
    startSession: StartSessionPod
    post: Post<ProxyResponse<StartSessionEvent>>

    constructor(startSession: StartSessionPod, post: Post<ProxyResponse<StartSessionEvent>>) {
        this.startSession = startSession
        this.post = post
    }

    handleMessage({ handlerID, message: { fields } }: ProxyMessage<StartSessionProxyMessage>): void {
        this.startSession()(fields, (event) => {
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
        message: { resetToken, fields },
    }: ProxyMessage<ResetProxyMessage>): void {
        const locationInfo = {
            getResetToken: () => resetToken,
        }
        this.reset(locationInfo)(fields, (event) => {
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
    resetSession: ResetSessionAction
    reset: ResetAction
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
        login: WorkerBackgroundHandler<LoginActionProxyMessage>
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
            login: newLoginActionBackgroundHandler((response) => {
                postBackgroundMessage({ type: "login", action: response })
            }),
        },
        passwordReset: {
            startSession: new StartSessionHandler(material.resetSession.startSession, (response) => {
                postBackgroundMessage({ type: "startSession", response })
            }),
            checkStatus: new CheckStatusHandler(material.resetSession.checkStatus, (response) => {
                postBackgroundMessage({ type: "checkStatus", response })
            }),
            reset: new ResetHandler(material.reset.reset, (response) => {
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
                    handler.passwordLogin.login(message.action)
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
