import { newWorker } from "../../../../../../z_getto/application/worker/foreground"

import { newRenewAuthnInfo } from "../../../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/main"
import { newAuthenticatePassword_proxy } from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/main/core"
import { newStartPasswordResetSessionResource_merge } from "../../../../../../auth/x_Resource/Sign/Password/ResetSession/Start/main/core"
import {
    newStartPasswordResetSessionResourceProxy,
    StartPasswordResetSessionResourceProxy,
} from "../../../../../../auth/x_Resource/Sign/Password/ResetSession/Start/main/worker/foreground"

import { currentURL } from "../../../../../../z_getto/infra/location/url"

import { initLoginViewLocationInfo, View } from "../../impl"

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

export function newLoginAsWorkerForeground(): AuthSignEntryPoint {
    const worker = newWorker()

    const webStorage = localStorage

    const proxy = initProxy(webStorage, postForegroundMessage)

    const view = new View(initLoginViewLocationInfo(currentURL()), {
        link: newAuthSignLinkResource,

        renew: () => newRenewAuthnInfo(webStorage),

        passwordLogin: () =>
            newAuthenticatePassword_proxy(webStorage, proxy.password.authenticate.background()),
        passwordResetSession: () =>
            newStartPasswordResetSessionResource_merge(proxy.password.resetSession.start.resource),
        passwordReset: () =>
            newRegisterPassword_proxy(
                webStorage,
                proxy.password.resetSession.register.background()
            ),
    })

    const messageHandler = initBackgroundMessageHandler(proxy, (err: string) => {
        view.error(err)
    })

    worker.addEventListener("message", (event) => {
        messageHandler(event.data)
    })

    return {
        view,
        terminate,
    }

    function postForegroundMessage(message: ForegroundMessage) {
        worker.postMessage(message)
    }
    function terminate() {
        worker.terminate()
        view.terminate()
    }
}

type Proxy = Readonly<{
    password: Readonly<{
        authenticate: AuthenticatePasswordProxy
        resetSession: Readonly<{
            register: RegisterPasswordProxy
            start: StartPasswordResetSessionResourceProxy
        }>
    }>
}>
function initProxy(webStorage: Storage, post: Post<ForegroundMessage>): Proxy {
    return {
        password: {
            authenticate: newAuthenticatePasswordProxy(webStorage, (message) =>
                post({ type: "password-authenticate", message })
            ),
            resetSession: {
                register: newRegisterPasswordProxy(webStorage, (message) =>
                    post({ type: "password-resetSession-register", message })
                ),
                start: newStartPasswordResetSessionResourceProxy((message) =>
                    post({ type: "password-resetSession-start", message })
                ),
            },
        },
    }
}
function initBackgroundMessageHandler(
    proxy: Proxy,
    errorHandler: Post<string>
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
