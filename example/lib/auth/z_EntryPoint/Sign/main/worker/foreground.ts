import { newWorker } from "../../../../../common/vendor/getto-worker/main/foreground"

import { newAuthSignRenewResource } from "../../resources/Renew/main"
import { newAuthSignPasswordAuthenticateResource_merge } from "../../resources/Password/Authenticate/main/core"

import { initLoginViewLocationInfo, View } from "../../impl"

import { initAuthSignLinkResource } from "../../resources/Link/impl"
import { initPasswordResetSessionResource } from "../../../../x_Resource/sign/PasswordResetSession/impl"

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
    AuthSignPasswordAuthenticateProxy,
    newAuthSignPasswordAuthenticateProxy,
} from "../../resources/Password/Authenticate/main/worker/foreground"
import {
    AuthSignPasswordResetSessionRegisterProxy,
    newAuthSignPasswordResetSessionRegisterProxy,
} from "../../resources/Password/ResetSession/Register/main/worker/foreground"
import { newAuthSignPasswordResetSessionRegisterResource_merge } from "../../resources/Password/ResetSession/Register/main/core"

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

        renew: () => newAuthSignRenewResource(webStorage),

        passwordLogin: () =>
            newAuthSignPasswordAuthenticateResource_merge(
                proxy.password.authenticate.resource
            ),
        passwordResetSession: () =>
            initPasswordResetSessionResource(foreground, background),
        passwordReset: () =>
            newAuthSignPasswordResetSessionRegisterResource_merge(
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
        authenticate: AuthSignPasswordAuthenticateProxy
        resetSession: Readonly<{
            register: AuthSignPasswordResetSessionRegisterProxy
        }>
    }>
    reset: Readonly<{
        session: PasswordResetSessionActionForegroundProxy
    }>
}>
function initProxy(webStorage: Storage, post: Post<ForegroundMessage>): Proxy {
    return {
        password: {
            authenticate: newAuthSignPasswordAuthenticateProxy(webStorage, (message) =>
                post({ type: "password-authenticate", message })
            ),
            resetSession: {
                register: newAuthSignPasswordResetSessionRegisterProxy(
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
