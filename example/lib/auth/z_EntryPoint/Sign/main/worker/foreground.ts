import { newWorker } from "../../../../../vendor/getto-worker/worker/foreground"

import { newContinuousRenewAction } from "../../../../sign/authCredential/continuousRenew/main"
import { newRenewActionPod } from "../../../../sign/authCredential/renew/main"

import { initLoginViewLocationInfo, View } from "../../impl"
import { initLoginLocationInfo } from "../../../../x_Resource/common/LocationInfo/impl"

import { initLoginLinkResource } from "../../../../x_Resource/common/LoginLink/impl"
import { initPasswordLoginResource } from "../../../../x_Resource/Sign/PasswordLogin/impl"
import { initPasswordResetResource } from "../../../../x_Resource/Sign/PasswordReset/impl"
import { initPasswordResetSessionResource } from "../../../../x_Resource/Sign/PasswordResetSession/impl"
import { initRenewCredentialResource } from "../../../../x_Resource/Sign/RenewCredential/impl"

import { newLocationAction } from "../../../../sign/location/main"
import { initFormAction } from "../../../../../vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../common/field/password/main/password"

import { LoginBackgroundActionPod, LoginEntryPoint, LoginForegroundAction } from "../../entryPoint"

import {
    LoginActionForegroundProxy,
    newLoginActionForegroundProxy,
} from "../../../../sign/password/login/worker/foreground"
import {
    newSessionActionForegroundProxy,
    SessionActionForegroundProxy,
} from "../../../../sign/password/reset/session/worker/foreground"
import {
    newRegisterActionForegroundProxy,
    RegisterActionForegroundProxy,
} from "../../../../sign/password/reset/register/worker/foreground"

import { ForegroundMessage, BackgroundMessage } from "./message"

export function newLoginAsWorkerForeground(): LoginEntryPoint {
    const worker = newWorker()

    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const foreground: LoginForegroundAction = {
        renew: newRenewActionPod(webStorage),
        continuousRenew: newContinuousRenewAction(webStorage),

        location: newLocationAction(),

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

    const locationInfo = initLoginLocationInfo(currentURL)

    const view = new View(initLoginViewLocationInfo(currentURL), {
        loginLink: initLoginLinkResource,

        renewCredential: () => initRenewCredentialResource(foreground),

        passwordLogin: () => initPasswordLoginResource(foreground, background),
        passwordResetSession: () => initPasswordResetSessionResource(foreground, background),
        passwordReset: () => initPasswordResetResource(locationInfo, foreground, background),
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
    login: LoginActionForegroundProxy
    reset: Readonly<{
        session: SessionActionForegroundProxy
        register: RegisterActionForegroundProxy
    }>
}>
function initProxy(post: Post<ForegroundMessage>): Proxy {
    return {
        login: newLoginActionForegroundProxy((message) => post({ type: "login", message })),
        reset: {
            session: newSessionActionForegroundProxy((message) =>
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
