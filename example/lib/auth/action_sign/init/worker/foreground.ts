import { newCheckAuthTicketView } from "../../../auth_ticket/action_check/init"
import { newSignViewLocationDetecter } from "../../../common/switch_view/init"

import {
    AuthenticatePasswordProxy,
    newAuthenticatePasswordProxy,
} from "../../../password/action_authenticate/init/worker/foreground"
import {
    newRequestPasswordResetTokenProxy,
    RequestPasswordResetTokenProxy,
} from "../../../password/reset/action_request_token/init/worker/foreground"
import {
    CheckPasswordResetSendingStatusProxy,
    newCheckPasswordResetSendingStatusProxy,
} from "../../../password/reset/action_check_status/init/worker/foreground"
import {
    newResetPasswordProxy,
    ResetPasswordProxy,
} from "../../../password/reset/action_reset/init/worker/foreground"

import { initSignView } from "../../impl"
import { initSignAction } from "../../core/impl"

import { ForegroundMessage, BackgroundMessage } from "./message"

import { SignView } from "../../resource"
import { initSignLinkResource } from "../../../common/nav/action_nav/impl"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
    worker: Worker
}>
export function newSignWorkerForeground(feature: OutsideFeature): SignView {
    const { currentLocation, worker } = feature
    const proxy = initProxy(postForegroundMessage)

    const sign = initSignAction(newSignViewLocationDetecter(currentLocation), {
        link: () => initSignLinkResource(),

        check: () => newCheckAuthTicketView(feature),

        password_authenticate: () => proxy.password.authenticate.view(feature),
        password_reset_requestToken: () => proxy.password.reset.requestToken.view(),
        password_reset_checkStatus: () => proxy.password.reset.checkStatus.view(feature),
        password_reset: () => proxy.password.reset.reset.view(feature),
    })

    const messageHandler = initBackgroundMessageHandler(proxy, (err: string) => {
        sign.error(err)
    })

    worker.addEventListener("message", (event) => {
        messageHandler(event.data)
    })

    const view = initSignView(sign)
    return {
        resource: view.resource,
        terminate: () => {
            worker.terminate()
            view.terminate()
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
