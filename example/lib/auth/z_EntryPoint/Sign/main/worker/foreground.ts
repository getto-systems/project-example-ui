import { newWorker } from "../../../../../common/vendor/getto-worker/main/foreground"

import { newRenewAuthInfoResource } from "../../../../x_Resource/Sign/AuthInfo/Renew/main"
import { newPasswordAuthenticateResource_merge } from "../../../../x_Resource/Sign/Password/Authenticate/main/core"

import { initLoginViewLocationInfo, View } from "../../impl"

import { initAuthSignLinkResource } from "../../../../x_Resource/Sign/Link/impl"
import { initPasswordResetSessionResource } from "../../../../x_Resource/Sign/PasswordResetSession/impl"

import { initFormAction } from "../../../../../common/vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../common/field/password/main/password"

import { AuthSignEntryPoint } from "../../entryPoint"

import {
    newPasswordResetSessionActionForegroundProxy,
    PasswordResetSessionActionForegroundProxy,
} from "../../../../sign/password/resetSession/start/main/worker/foreground"

import { ForegroundMessage, BackgroundMessage } from "./message"
import {
    AuthenticatePasswordResourceProxy,
    newAuthenticatePasswordResourceProxy,
} from "../../../../x_Resource/Sign/Password/Authenticate/main/worker/foreground"
import {
    RegisterPasswordResourceProxy,
    newRegisterPasswordResourceProxy,
} from "../../../../x_Resource/Sign/Password/ResetSession/Register/main/worker/foreground"
import { newRegisterPasswordResource_merge } from "../../../../x_Resource/Sign/Password/ResetSession/Register/main/core"

export function newLoginAsWorkerForeground(): AuthSignEntryPoint {
    const worker = newWorker()

    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const foreground = {
        form: {
            core: initFormAction(),
            loginID: initLoginIDFormFieldAction(),
            password: initPasswordFormFieldAction(),
        },
    }

    const proxy = initProxy(webStorage, postForegroundMessage)
    const background = {
        initSession: proxy.reset.session.pod(),
    }

    const view = new View(initLoginViewLocationInfo(currentURL), {
        link: initAuthSignLinkResource,

        renew: () => newRenewAuthInfoResource(webStorage),

        passwordLogin: () =>
            newPasswordAuthenticateResource_merge(
                proxy.password.authenticate.resource
            ),
        passwordResetSession: () =>
            initPasswordResetSessionResource(foreground, background),
        passwordReset: () =>
            newRegisterPasswordResource_merge(
                proxy.password.resetSession.register.resource
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
        authenticate: AuthenticatePasswordResourceProxy
        resetSession: Readonly<{
            register: RegisterPasswordResourceProxy
        }>
    }>
    reset: Readonly<{
        session: PasswordResetSessionActionForegroundProxy
    }>
}>
function initProxy(webStorage: Storage, post: Post<ForegroundMessage>): Proxy {
    return {
        password: {
            authenticate: newAuthenticatePasswordResourceProxy(webStorage, (message) =>
                post({ type: "password-authenticate", message })
            ),
            resetSession: {
                register: newRegisterPasswordResourceProxy(
                    webStorage,
                    (message) => post({ type: "password-resetSession-register", message })
                ),
            },
        },
        reset: {
            session: newPasswordResetSessionActionForegroundProxy((message) =>
                post({ type: "reset-session", message })
            ),
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

                case "reset-session":
                    proxy.reset.session.resolve(message.response)
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
