import { newAuthenticatePasswordResourceHandler } from "../../../../x_Resource/Sign/Password/Authenticate/main/worker/background"
import { newRegisterPasswordResourceHandler } from "../../../../x_Resource/Sign/Password/ResetSession/Register/main/worker/background"

import { WorkerHandler } from "../../../../../common/vendor/getto-worker/main/background"

import { ForegroundMessage, BackgroundMessage } from "./message"

import { AuthenticatePasswordResourceProxyMessage } from "../../../../x_Resource/Sign/Password/Authenticate/main/worker/message"
import { RegisterPasswordResourceProxyMessage } from "../../../../x_Resource/Sign/Password/ResetSession/Register/main/worker/message"
import { PasswordResetSessionActionProxyMessage } from "../../../../sign/password/resetSession/start/main/worker/message"

import { newPasswordResetSessionActionBackgroundHandler } from "../../../../sign/password/resetSession/start/main/worker/background"

export function newLoginWorker(worker: Worker): void {
    const handler: Handler = {
        password: {
            authenticate: newAuthenticatePasswordResourceHandler((response) =>
                postBackgroundMessage({ type: "password-authenticate", response })
            ),
            resetSession: {
                register: newRegisterPasswordResourceHandler((response) =>
                    postBackgroundMessage({
                        type: "password-resetSession-register",
                        response,
                    })
                ),
            },
        },
        reset: {
            session: newPasswordResetSessionActionBackgroundHandler((response) =>
                postBackgroundMessage({ type: "reset-session", response })
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
    password: Readonly<{
        authenticate: WorkerHandler<AuthenticatePasswordResourceProxyMessage>
        resetSession: Readonly<{
            register: WorkerHandler<RegisterPasswordResourceProxyMessage>
        }>
    }>
    reset: Readonly<{
        session: WorkerHandler<PasswordResetSessionActionProxyMessage>
    }>
}>

function initForegroundMessageHandler(
    handler: Handler,
    errorHandler: Post<string>
): Post<ForegroundMessage> {
    return (message) => {
        try {
            switch (message.type) {
                case "password-authenticate":
                    handler.password.authenticate(message.message)
                    break

                case "reset-session":
                    handler.reset.session(message.message)
                    break

                case "password-resetSession-register":
                    handler.password.resetSession.register(message.message)
                    break

                default:
                    assertNever(message)
            }
        } catch (err) {
            errorHandler(`${err}`)
        }
    }
}

interface Post<M> {
    (message: M): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
