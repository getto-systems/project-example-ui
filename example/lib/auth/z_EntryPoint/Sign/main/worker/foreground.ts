import { newWorker } from "../../../../../vendor/getto-worker/main/foreground"

import { newAuthLocationAction } from "../../../../sign/authLocation/main"
import { newContinuousRenewAuthCredentialAction } from "../../../../sign/authCredential/continuousRenew/main"
import { newRenewAuthCredentialAction } from "../../../../sign/authCredential/renew/main"

import { initLoginViewLocationInfo, View } from "../../impl"

import { initAuthSignLinkResource } from "../../resources/Link/impl"
import { initAuthSignPasswordLoginResource } from "../../resources/Password/Login/impl"
import { initPasswordResetResource } from "../../../../x_Resource/sign/PasswordReset/impl"
import { initPasswordResetSessionResource } from "../../../../x_Resource/sign/PasswordResetSession/impl"
import { initAuthSignRenewResource } from "../../resources/Renew/impl"

import { initFormAction } from "../../../../../vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../common/field/password/main/password"
import { initPasswordResetRegisterActionLocationInfo } from "../../../../sign/password/reset/register/impl"

import { AuthSignEntryPoint } from "../../entryPoint"

import {
    PasswordLoginActionForegroundProxy,
    newPasswordLoginActionForegroundProxy,
} from "../../../../sign/password/login/main/worker/foreground"
import {
    newPasswordResetSessionActionForegroundProxy,
    PasswordResetSessionActionForegroundProxy,
} from "../../../../sign/password/reset/session/main/worker/foreground"
import {
    newPasswordResetRegisterActionForegroundProxy,
    RegisterActionForegroundProxy,
} from "../../../../sign/password/reset/register/main/worker/foreground"

import { ForegroundMessage, BackgroundMessage } from "./message"
import { initPasswordLoginAction } from "../../../../sign/password/login/impl"

export function newLoginAsWorkerForeground(): AuthSignEntryPoint {
    const worker = newWorker()

    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const foreground = {
        renew: newRenewAuthCredentialAction(webStorage),
        continuousRenew: newContinuousRenewAuthCredentialAction(webStorage),

        location: newAuthLocationAction(),

        form: {
            core: initFormAction(),
            loginID: initLoginIDFormFieldAction(),
            password: initPasswordFormFieldAction(),
        },
    }

    const proxy = initProxy(postForegroundMessage)
    const background = {
        initSession: proxy.reset.session.pod(),
        initRegister: proxy.reset.register.pod(),
    }

    const material = {
        login: {
            continuousRenew: newContinuousRenewAuthCredentialAction(webStorage),
            location: newAuthLocationAction(),
            login: initPasswordLoginAction(proxy.login.pod()),
        },

        form: formMaterial(),
    }

    const view = new View(initLoginViewLocationInfo(currentURL), {
        link: initAuthSignLinkResource,

        renewCredential: () => initAuthSignRenewResource(foreground),

        passwordLogin: () => initAuthSignPasswordLoginResource(material),
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
function formMaterial() {
    const form = initFormAction()
    const loginID = initLoginIDFormFieldAction()
    const password = initPasswordFormFieldAction()
    return {
        validation: form.validation(),
        history: form.history(),
        loginID: loginID.field(),
        password: password.field(),
        character: password.character(),
        viewer: password.viewer(),
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
            register: newPasswordResetRegisterActionForegroundProxy((message) =>
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
