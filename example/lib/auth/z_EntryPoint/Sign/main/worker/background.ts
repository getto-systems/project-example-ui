import { WorkerHandler } from "../../../../../common/vendor/getto-worker/main/background"

import { ForegroundMessage, BackgroundMessage } from "./message"

import { AuthSignPasswordAuthenticateProxyMessage } from "../../resources/Password/Authenticate/main/worker/message"
import { PasswordResetSessionActionProxyMessage } from "../../../../sign/password/resetSession/start/main/worker/message"
import { PasswordResetRegisterActionProxyMessage } from "../../../../sign/password/resetSession/register/main/worker/message"

import { newAuthSignPasswordAuthenticateHandler } from "../../resources/Password/Authenticate/main/worker/background"
import { newPasswordResetSessionActionBackgroundHandler } from "../../../../sign/password/resetSession/start/main/worker/background"
import { newPasswordResetRegisterActionBackgroundHandler } from "../../../../sign/password/resetSession/register/main/worker/background"

export function newLoginWorker(worker: Worker): void {
    const handler: Handler = {
        password: {
            authenticate: newAuthSignPasswordAuthenticateHandler((response) =>
                postBackgroundMessage({ type: "password-authenticate", response })
            ),
        },
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
    password: Readonly<{
        authenticate: WorkerHandler<AuthSignPasswordAuthenticateProxyMessage>
    }>
    reset: Readonly<{
        session: WorkerHandler<PasswordResetSessionActionProxyMessage>
        register: WorkerHandler<PasswordResetRegisterActionProxyMessage>
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

interface Post<M> {
    (message: M): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
