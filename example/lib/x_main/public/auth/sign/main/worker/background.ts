import { newAuthenticatePasswordHandler } from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/init/worker/background"
import { newRequestPasswordResetTokenHandler } from "../../../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/init/worker/background"
import { newCheckPasswordResetSendingStatusWorkerHandler } from "../../../../../../auth/sign/password/reset/checkStatus/x_Action/CheckStatus/init/worker/background"
import { newResetPasswordHandler } from "../../../../../../auth/sign/password/reset/reset/x_Action/Reset/init/worker/background"

import { WorkerHandler } from "../../../../../../z_getto/application/worker/background"

import { ForegroundMessage, BackgroundMessage } from "./message"
import { AuthenticatePasswordProxyMessage } from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/init/worker/message"
import { RequestPasswordResetTokenProxyMessage } from "../../../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/init/worker/message"
import { CheckPasswordResetSendingStatusProxyMessage } from "../../../../../../auth/sign/password/reset/checkStatus/x_Action/CheckStatus/init/worker/message"
import { ResetPasswordProxyMessage } from "../../../../../../auth/sign/password/reset/reset/x_Action/Reset/init/worker/message"

export function newWorkerBackground(worker: Worker): void {
    const handler: Handler = {
        password: {
            authenticate: newAuthenticatePasswordHandler((response) =>
                postBackgroundMessage({ type: "password-authenticate", response }),
            ),
            reset: {
                requestToken: newRequestPasswordResetTokenHandler((response) =>
                    postBackgroundMessage({ type: "password-reset-requestToken", response }),
                ),
                checkStatus: newCheckPasswordResetSendingStatusWorkerHandler((response) =>
                    postBackgroundMessage({ type: "password-reset-checkStatus", response }),
                ),
                reset: newResetPasswordHandler((response) =>
                    postBackgroundMessage({
                        type: "password-reset",
                        response,
                    }),
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
        reset: Readonly<{
            requestToken: WorkerHandler<RequestPasswordResetTokenProxyMessage>
            checkStatus: WorkerHandler<CheckPasswordResetSendingStatusProxyMessage>
            reset: WorkerHandler<ResetPasswordProxyMessage>
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

                case "password-reset-requestToken":
                    handler.password.reset.requestToken(message.message)
                    break

                case "password-reset-checkStatus":
                    handler.password.reset.checkStatus(message.message)
                    break

                case "password-reset":
                    handler.password.reset.reset(message.message)
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
