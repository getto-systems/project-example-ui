import { newAuthenticatePasswordHandler } from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/main/worker/background"
import { newStartPasswordResetSessionHandler } from "../../../../../../auth/sign/password/resetSession/start/x_Action/Start/main/worker/background"
import { newRegisterPasswordHandler } from "../../../../../../auth/sign/password/resetSession/register/x_Action/Register/main/worker/background"

import { WorkerHandler } from "../../../../../../z_getto/application/worker/background"

import { ForegroundMessage, BackgroundMessage } from "./message"
import { AuthenticatePasswordProxyMessage } from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/main/worker/message"
import { RegisterPasswordProxyMessage } from "../../../../../../auth/sign/password/resetSession/register/x_Action/Register/main/worker/message"
import { StartPasswordResetSessionProxyMessage } from "../../../../../../auth/sign/password/resetSession/start/x_Action/Start/main/worker/message"

export function newWorkerBackground(worker: Worker): void {
    const handler: Handler = {
        password: {
            authenticate: newAuthenticatePasswordHandler((response) =>
                postBackgroundMessage({ type: "password-authenticate", response }),
            ),
            resetSession: {
                register: newRegisterPasswordHandler((response) =>
                    postBackgroundMessage({
                        type: "password-resetSession-register",
                        response,
                    }),
                ),
                start: newStartPasswordResetSessionHandler((response) =>
                    postBackgroundMessage({ type: "password-resetSession-start", response }),
                ),
            },
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
        authenticate: WorkerHandler<AuthenticatePasswordProxyMessage>
        resetSession: Readonly<{
            register: WorkerHandler<RegisterPasswordProxyMessage>
            start: WorkerHandler<StartPasswordResetSessionProxyMessage>
        }>
    }>
}>

function initForegroundMessageHandler(
    handler: Handler,
    errorHandler: Post<string>,
): Post<ForegroundMessage> {
    return (message) => {
        try {
            switch (message.type) {
                case "password-authenticate":
                    handler.password.authenticate(message.message)
                    break

                case "password-resetSession-start":
                    handler.password.resetSession.start(message.message)
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
