import { WorkerBackgroundHandler } from "../../../../../vendor/getto-worker/worker/background"

import { ForegroundMessage, BackgroundMessage } from "./message"

import { LoginActionProxyMessage } from "../../../../sign/password/login/worker/message"
import { SessionActionProxyMessage } from "../../../../sign/password/reset/session/worker/message"
import { RegisterActionProxyMessage } from "../../../../sign/password/reset/register/worker/message"

import { newLoginActionBackgroundHandler } from "../../../../sign/password/login/worker/background"
import { newSessionActionBackgroundHandler } from "../../../../sign/password/reset/session/worker/background"
import { newRegisterActionBackgroundHandler } from "../../../../sign/password/reset/register/worker/background"

export function newLoginWorker(worker: Worker): void {
    const handler: Handler = {
        login: newLoginActionBackgroundHandler((response) =>
            postBackgroundMessage({ type: "login", response })
        ),
        reset: {
            session: newSessionActionBackgroundHandler((response) =>
                postBackgroundMessage({ type: "reset-session", response })
            ),
            register: newRegisterActionBackgroundHandler((response) =>
                postBackgroundMessage({ type: "reset-register", response })
            ),
        },
    }

    const messageHandler = initForegroundMessageHandler(handler, (err: string) => {
        postBackgroundMessage({ type: "error", err })
    })

    worker.addEventListener("message", (event) => {
        messageHandler(event.data)
    })

    function postBackgroundMessage(message: BackgroundMessage) {
        worker.postMessage(message)
    }
}

type Handler = Readonly<{
    login: WorkerBackgroundHandler<LoginActionProxyMessage>
    reset: Readonly<{
        session: WorkerBackgroundHandler<SessionActionProxyMessage>
        register: WorkerBackgroundHandler<RegisterActionProxyMessage>
    }>
}>

function initForegroundMessageHandler(
    handler: Handler,
    errorHandler: Post<string>
): Post<ForegroundMessage> {
    return (message) => {
        try {
            switch (message.type) {
                case "login":
                    handler.login(message.message)
                    break

                case "reset-session":
                    handler.reset.session(message.message)
                    break

                case "reset-register":
                    handler.reset.register(message.message)
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
