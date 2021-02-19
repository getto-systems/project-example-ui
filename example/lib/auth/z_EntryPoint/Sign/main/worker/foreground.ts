import { newWorker } from "../../../../../z_vendor/getto-worker/foreground"

import { newRenewAuthnInfoAction } from "../../../../sign/kernel/authnInfo/renew/x_Action/Renew/main"
import { newAuthenticatePassword_proxy } from "../../../../sign/password/authenticate/x_Action/Authenticate/main/core"
import { newRegisterPasswordResource_merge } from "../../../../x_Resource/Sign/Password/ResetSession/Register/main/core"
import { newStartPasswordResetSessionResource_merge } from "../../../../x_Resource/Sign/Password/ResetSession/Start/main/core"
import {
    RegisterPasswordResourceProxy,
    newRegisterPasswordResourceProxy,
} from "../../../../x_Resource/Sign/Password/ResetSession/Register/main/worker/foreground"
import {
    newStartPasswordResetSessionResourceProxy,
    StartPasswordResetSessionResourceProxy,
} from "../../../../x_Resource/Sign/Password/ResetSession/Start/main/worker/foreground"

import { currentURL } from "../../../../../z_infra/location/url"

import { initLoginViewLocationInfo, View } from "../../impl"

import { newAuthSignLinkResource } from "../../../../sign/common/searchParams/x_Action/Link/impl"

import { AuthSignEntryPoint } from "../../entryPoint"

import { ForegroundMessage, BackgroundMessage } from "./message"
import {
    AuthenticatePasswordProxy,
    newAuthenticatePasswordProxy,
} from "../../../../sign/password/authenticate/x_Action/Authenticate/main/worker/foreground"

export function newLoginAsWorkerForeground(): AuthSignEntryPoint {
    const worker = newWorker()

    const webStorage = localStorage

    const proxy = initProxy(webStorage, postForegroundMessage)

    const view = new View(initLoginViewLocationInfo(currentURL()), {
        link: newAuthSignLinkResource,

        renew: () => ({ renew: newRenewAuthnInfoAction(webStorage) }),

        passwordLogin: () =>
            newAuthenticatePassword_proxy(webStorage, proxy.password.authenticate.background()),
        passwordResetSession: () =>
            newStartPasswordResetSessionResource_merge(proxy.password.resetSession.start.resource),
        passwordReset: () =>
            newRegisterPasswordResource_merge(proxy.password.resetSession.register.resource),
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
            register: RegisterPasswordResourceProxy
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
                register: newRegisterPasswordResourceProxy(webStorage, (message) =>
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
