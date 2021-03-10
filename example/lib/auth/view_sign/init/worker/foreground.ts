import { newCheckAuthInfoEntryPoint } from "../../../sign/kernel/auth_info/action_check/init"
import { newSignViewLocationDetecter } from "../../../sign/view/impl/init"

import {
    AuthenticatePasswordProxy,
    newAuthenticatePasswordProxy,
} from "../../../sign/password/view_authenticate/init/worker/foreground"
import {
    newRequestPasswordResetTokenProxy,
    RequestPasswordResetTokenProxy,
} from "../../../sign/password/reset/view_request_token/init/worker/foreground"
import {
    CheckPasswordResetSendingStatusProxy,
    newCheckPasswordResetSendingStatusProxy,
} from "../../../sign/password/reset/view_check_status/init/worker/foreground"
import {
    newResetPasswordProxy,
    ResetPasswordProxy,
} from "../../../sign/password/reset/view_reset/init/worker/foreground"

import { initSignEntryPoint } from "../../impl"
import { initSignAction } from "../../core/impl"

import { ForegroundMessage, BackgroundMessage } from "./message"

import { SignEntryPoint } from "../../entry_point"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
    worker: Worker
}>
export function newSignWorkerForeground(feature: OutsideFeature): SignEntryPoint {
    const { currentLocation, worker } = feature
    const proxy = initProxy(postForegroundMessage)

    const view = initSignAction(newSignViewLocationDetecter(currentLocation), {
        check: () => newCheckAuthInfoEntryPoint(feature),

        password_authenticate: () => proxy.password.authenticate.entryPoint(feature),
        password_reset_requestToken: () => proxy.password.reset.requestToken.entryPoint(),
        password_reset_checkStatus: () => proxy.password.reset.checkStatus.entryPoint(feature),
        password_reset: () => proxy.password.reset.reset.entryPoint(feature),
    })

    const messageHandler = initBackgroundMessageHandler(proxy, (err: string) => {
        view.error(err)
    })

    worker.addEventListener("message", (event) => {
        messageHandler(event.data)
    })

    const entryPoint = initSignEntryPoint(view)
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
function initProxy(post: Post<ForegroundMessage>): Proxy {
    return {
        password: {
            authenticate: newAuthenticatePasswordProxy((message) =>
                post({ type: "password-authenticate", message }),
            ),
            reset: {
                requestToken: newRequestPasswordResetTokenProxy((message) =>
                    post({ type: "password-reset-requestToken", message }),
                ),
                checkStatus: newCheckPasswordResetSendingStatusProxy((message) =>
                    post({ type: "password-reset-checkStatus", message }),
                ),
                reset: newResetPasswordProxy((message) =>
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
