import { newRenewAuthnInfo } from "../../../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/main"
import { newAuthenticatePassword_proxy } from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/main/core"
import { newStartPasswordResetSession_proxy } from "../../../../../../auth/sign/password/resetSession/start/x_Action/Start/main/core"

import { initLoginViewLocationInfo, toAuthSignEntryPoint, View } from "../../impl"

import { newAuthSignLinkResource } from "../../../../../../auth/sign/common/searchParams/x_Action/Link/impl"

import { AuthSignEntryPoint } from "../../entryPoint"

import { ForegroundMessage, BackgroundMessage } from "./message"
import {
    AuthenticatePasswordProxy,
    newAuthenticatePasswordProxy,
} from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/main/worker/foreground"
import { newRegisterPassword_proxy } from "../../../../../../auth/sign/password/resetSession/register/x_Action/Register/main/core"
import {
    newRegisterPasswordProxy,
    RegisterPasswordProxy,
} from "../../../../../../auth/sign/password/resetSession/register/x_Action/Register/main/worker/foreground"
import {
    newStartPasswordResetSessionProxy,
    StartPasswordResetSessionProxy,
} from "../../../../../../auth/sign/password/resetSession/start/x_Action/Start/main/worker/foreground"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentURL: URL
    worker: Worker
}>
export function newWorkerForeground(feature: OutsideFeature): AuthSignEntryPoint {
    const { webStorage, currentURL, worker } = feature
    const proxy = initProxy(webStorage, currentURL, postForegroundMessage)

    const view = new View(initLoginViewLocationInfo(currentURL), {
        link: newAuthSignLinkResource,

        renew: () => newRenewAuthnInfo(webStorage, currentURL),

        passwordLogin: () =>
            newAuthenticatePassword_proxy(
                webStorage,
                currentURL,
                proxy.password.authenticate.pod(),
            ),
        passwordResetSession: () =>
            newStartPasswordResetSession_proxy(proxy.password.resetSession.start.pod()),
        passwordReset: () =>
            newRegisterPassword_proxy(
                webStorage,
                currentURL,
                proxy.password.resetSession.register.pod(),
            ),
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
        resetSession: Readonly<{
            register: RegisterPasswordProxy
            start: StartPasswordResetSessionProxy
        }>
    }>
}>
function initProxy(webStorage: Storage, currentURL: URL, post: Post<ForegroundMessage>): Proxy {
    return {
        password: {
            authenticate: newAuthenticatePasswordProxy(webStorage, (message) =>
                post({ type: "password-authenticate", message }),
            ),
            resetSession: {
                register: newRegisterPasswordProxy(webStorage, (message) =>
                    post({ type: "password-resetSession-register", message }),
                ),
                start: newStartPasswordResetSessionProxy((message) =>
                    post({ type: "password-resetSession-start", message }),
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

                case "password-resetSession-start":
                    proxy.password.resetSession.start.resolve(message.response)
                    break

                case "password-resetSession-register":
                    proxy.password.resetSession.register.resolve(message.response)
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
