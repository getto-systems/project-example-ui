import { newAuthenticatePasswordHandler } from "../../../sign/password/action_authenticate/init/worker/background"
import { newRequestResetTokenHandler } from "../../../sign/password/reset/action_request_token/init/worker/background"
import { newCheckPasswordResetSendingStatusWorkerHandler } from "../../../sign/password/reset/action_check_status/init/worker/background"
import { newResetPasswordHandler } from "../../../sign/password/reset/action_reset/init/worker/background"

import { WorkerHandler } from "../../../../z_vendor/getto-application/action/worker/background"

import { ForegroundMessage, BackgroundMessage } from "./message"
import { AuthenticatePasswordProxyMessage } from "../../../sign/password/action_authenticate/init/worker/message"
import { RequestPasswordResetTokenProxyMessage } from "../../../sign/password/reset/action_request_token/init/worker/message"
import { CheckPasswordResetSendingStatusProxyMessage } from "../../../sign/password/reset/action_check_status/init/worker/message"
import { ResetPasswordProxyMessage } from "../../../sign/password/reset/action_reset/init/worker/message"

export function newSignWorkerBackground(worker: Worker): void {
    const handler: Handler = {
        password: {
            authenticate: newAuthenticatePasswordHandler((response) =>
                postBackgroundMessage({ type: "password-authenticate", response }),
            ),
            reset: {
                requestToken: newRequestResetTokenHandler((response) =>
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
