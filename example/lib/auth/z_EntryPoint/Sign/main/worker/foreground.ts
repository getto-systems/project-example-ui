import { newWorker } from "../../../../../vendor/getto-worker/main/foreground"

import { newAuthLocationAction } from "../../../../sign/authLocation/main"
import { newContinuousRenewAuthCredentialAction } from "../../../../sign/authCredential/continuousRenew/main"
import { newRenewAuthCredentialActionPod } from "../../../../sign/authCredential/renew/main"

import { initLoginViewLocationInfo, View } from "../../impl"

import { initSignLinkResource } from "../../Link/impl"
import { initPasswordLoginResource } from "../../../../x_Resource/sign/PasswordLogin/impl"
import { initPasswordResetResource } from "../../../../x_Resource/sign/PasswordReset/impl"
import { initPasswordResetSessionResource } from "../../../../x_Resource/sign/PasswordResetSession/impl"
import { initRenewCredentialResource } from "../../../../x_Resource/sign/authCredential/Renew/impl"

import { initFormAction } from "../../../../../vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../common/field/password/main/password"
import { initPasswordResetRegisterActionLocationInfo } from "../../../../sign/password/reset/register/impl"

import { LoginBackgroundActionPod, LoginEntryPoint, LoginForegroundAction } from "../../entryPoint"

import {
    PasswordLoginActionForegroundProxy,
    newPasswordLoginActionForegroundProxy,
} from "../../../../sign/password/login/main/worker/foreground"
import {
    newPasswordResetSessionActionForegroundProxy,
    PasswordResetSessionActionForegroundProxy,
} from "../../../../sign/password/reset/session/main/worker/foreground"
import {
    newRegisterActionForegroundProxy,
    RegisterActionForegroundProxy,
} from "../../../../sign/password/reset/register/main/worker/foreground"

import { ForegroundMessage, BackgroundMessage } from "./message"

export function newLoginAsWorkerForeground(): LoginEntryPoint {
    const worker = newWorker()

    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const foreground: LoginForegroundAction = {
        renew: newRenewAuthCredentialActionPod(webStorage),
        continuousRenew: newContinuousRenewAuthCredentialAction(webStorage),

        location: newAuthLocationAction(),

        form: {
            core: initFormAction(),
            loginID: initLoginIDFormFieldAction(),
            password: initPasswordFormFieldAction(),
        },
    }

    const proxy = initProxy(postForegroundMessage)
    const background: LoginBackgroundActionPod = {
        initLogin: proxy.login.pod(),
        initSession: proxy.reset.session.pod(),
        initRegister: proxy.reset.register.pod(),
    }

    const view = new View(initLoginViewLocationInfo(currentURL), {
        loginLink: initSignLinkResource,

        renewCredential: () => initRenewCredentialResource(foreground),

        passwordLogin: () => initPasswordLoginResource(foreground, background),
        passwordResetSession: () => initPasswordResetSessionResource(foreground, background),
        passwordReset: () =>
            initPasswordResetResource(
                initPasswordResetRegisterActionLocationInfo(currentURL),
                foreground,
                background
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
    login: PasswordLoginActionForegroundProxy
    reset: Readonly<{
        session: PasswordResetSessionActionForegroundProxy
        register: RegisterActionForegroundProxy
    }>
}>
function initProxy(post: Post<ForegroundMessage>): Proxy {
    return {
        login: newPasswordLoginActionForegroundProxy((message) => post({ type: "login", message })),
        reset: {
            session: newPasswordResetSessionActionForegroundProxy((message) =>
                post({ type: "reset-session", message })
            ),
            register: newRegisterActionForegroundProxy((message) =>
                post({ type: "reset-register", message })
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
                case "login":
                    proxy.login.resolve(message.response)
                    break

                case "reset-session":
                    proxy.reset.session.resolve(message.response)
                    break

                case "reset-register":
                    proxy.reset.register.resolve(message.response)
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
