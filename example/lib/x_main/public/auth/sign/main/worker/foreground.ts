import { newRenewAuthnInfo } from "../../../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/main"
import { newAuthenticatePassword_proxy } from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/main/core"
import { newResetPassword_proxy } from "../../../../../../auth/sign/password/reset/reset/x_Action/Reset/main/core"
import { newRequestPasswordResetToken_proxy } from "../../../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/main/core"
import { newCheckPasswordResetSendingStatus_proxy } from "../../../../../../auth/sign/password/reset/checkStatus/x_Action/CheckStatus/main/core"

import { initLoginViewLocationInfo, toAuthSignEntryPoint, View } from "../../impl"

import {
    AuthenticatePasswordProxy,
    newAuthenticatePasswordProxy,
} from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/main/worker/foreground"
import {
    newRequestPasswordResetTokenProxy,
    RequestPasswordResetTokenProxy,
} from "../../../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/main/worker/foreground"
import {
    CheckPasswordResetSendingStatusProxy,
    newCheckPasswordResetSendingStatusProxy,
} from "../../../../../../auth/sign/password/reset/checkStatus/x_Action/CheckStatus/main/worker/foreground"
import {
    newResetPasswordProxy,
    ResetPasswordProxy,
} from "../../../../../../auth/sign/password/reset/reset/x_Action/Reset/main/worker/foreground"

import { ForegroundMessage, BackgroundMessage } from "./message"

import { AuthSignEntryPoint } from "../../entryPoint"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentURL: URL
    worker: Worker
}>
export function newWorkerForeground(feature: OutsideFeature): AuthSignEntryPoint {
    const { webStorage, currentURL, worker } = feature
    const proxy = initProxy(webStorage, currentURL, postForegroundMessage)

    const view = new View(initLoginViewLocationInfo(currentURL), {
        renew: () => newRenewAuthnInfo(webStorage, currentURL),

        password_authenticate: () =>
            newAuthenticatePassword_proxy(
                webStorage,
                currentURL,
                proxy.password.authenticate.pod(),
            ),
        password_reset_requestToken: () =>
            newRequestPasswordResetToken_proxy(proxy.password.reset.requestToken.pod()),
        password_reset_checkStatus: () =>
            newCheckPasswordResetSendingStatus_proxy(
                currentURL,
                proxy.password.reset.checkStatus.pod(),
            ),
        password_reset: () =>
            newResetPassword_proxy(webStorage, currentURL, proxy.password.reset.reset.pod()),
    })

    const messageHandler = initBackgroundMessageHandler(proxy, (err: string) => {
        // TODO これは公開されてるやつじゃないぞ
        view.error(err)
    })

    worker.addEventListener("message", (event) => {
        messageHandler(event.data)
    })

    const entryPoint = toAuthSignEntryPoint(view)
    return {
        resource: entryPoint.resource,
        terminate: () => {
            worker.terminate()
            entryPoint.terminate()
        },
    }

    function postForegroundMessage(message: ForegroundMessage) {
        worker.postMessage(message)
    }
}

type Proxy = Readonly<{
    password: Readonly<{
        authenticate: AuthenticatePasswordProxy
        reset: Readonly<{
            requestToken: RequestPasswordResetTokenProxy
            checkStatus: CheckPasswordResetSendingStatusProxy
            reset: ResetPasswordProxy
        }>
    }>
}>
function initProxy(webStorage: Storage, currentURL: URL, post: Post<ForegroundMessage>): Proxy {
    return {
        password: {
            authenticate: newAuthenticatePasswordProxy(webStorage, (message) =>
                post({ type: "password-authenticate", message }),
            ),
            reset: {
                requestToken: newRequestPasswordResetTokenProxy((message) =>
                    post({ type: "password-reset-requestToken", message }),
                ),
                checkStatus: newCheckPasswordResetSendingStatusProxy((message) =>
                    post({ type: "password-reset-checkStatus", message }),
                ),
                reset: newResetPasswordProxy(webStorage, (message) =>
                    post({ type: "password-reset", message }),
                ),
            },
        },
    }
}
function initBackgroundMessageHandler(
    proxy: Proxy,
    errorHandler: Post<string>,
): Post<BackgroundMessage> {
    return (message) => {
        try {
            switch (message.type) {
                case "password-authenticate":
                    proxy.password.authenticate.resolve(message.response)
                    break

                case "password-reset-requestToken":
                    proxy.password.reset.requestToken.resolve(message.response)
                    break

                case "password-reset-checkStatus":
                    proxy.password.reset.checkStatus.resolve(message.response)
                    break

                case "password-reset":
                    proxy.password.reset.reset.resolve(message.response)
                    break

                case "error":
                    errorHandler(message.err)
                    break

                default:
                    assertNever(message)
            }
        } catch (err) {
            errorHandler(`${err}`)
        }
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}

interface Post<T> {
    (state: T): void
}
