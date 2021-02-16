import { WorkerBackgroundHandler } from "../../../../../vendor/getto-worker/main/background"

import { ForegroundMessage, BackgroundMessage } from "./message"

import { PasswordLoginActionProxyMessage } from "../../../../sign/password/authenticate/main/worker/message"
import { PasswordResetSessionActionProxyMessage } from "../../../../sign/password/resetSession/start/main/worker/message"
import { PasswordResetRegisterActionProxyMessage } from "../../../../sign/password/resetSession/register/main/worker/message"

import { newPasswordLoginActionBackgroundHandler } from "../../../../sign/password/authenticate/main/worker/background"
import { newPasswordResetSessionActionBackgroundHandler } from "../../../../sign/password/resetSession/start/main/worker/background"
import { newPasswordResetRegisterActionBackgroundHandler } from "../../../../sign/password/resetSession/register/main/worker/background"

export function newLoginWorker(worker: Worker): void {
    const handler: Handler = {
        login: newPasswordLoginActionBackgroundHandler((response) =>
            postBackgroundMessage({ type: "login", response })
        ),
        reset: {
            session: newPasswordResetSessionActionBackgroundHandler((response) =>
                postBackgroundMessage({ type: "reset-session", response })
            ),
            register: newPasswordResetRegisterActionBackgroundHandler((response) =>
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
    login: WorkerBackgroundHandler<PasswordLoginActionProxyMessage>
    reset: Readonly<{
        session: WorkerBackgroundHandler<PasswordResetSessionActionProxyMessage>
        register: WorkerBackgroundHandler<PasswordResetRegisterActionProxyMessage>
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
