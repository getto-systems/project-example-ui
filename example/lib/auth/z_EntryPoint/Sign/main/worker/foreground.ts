import { newWorker } from "../../../../../common/vendor/getto-worker/main/foreground"

import { newAuthSignRenewResource } from "../../resources/Renew/main"
import { newAuthSignPasswordAuthenticateResource_merge } from "../../resources/Password/Authenticate/main/core"

import { newAuthLocationAction_legacy } from "../../../../sign/secureScriptPath/get/main"
import { newContinuousRenewAuthnInfoAction_legacy } from "../../../../sign/authnInfo/startContinuousRenew/main"

import { initLoginViewLocationInfo, View } from "../../impl"

import { initAuthSignLinkResource } from "../../resources/Link/impl"
import { initPasswordResetResource } from "../../resources/Password/Reset/Register/impl"
import { initPasswordResetSessionResource } from "../../../../x_Resource/sign/PasswordResetSession/impl"

import { initFormAction } from "../../../../../common/vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../common/field/password/main/password"
import {
    initPasswordResetRegisterAction,
    initPasswordResetRegisterActionLocationInfo,
} from "../../../../sign/password/resetSession/register/impl"

import { AuthSignEntryPoint } from "../../entryPoint"

import {
    newPasswordResetSessionActionForegroundProxy,
    PasswordResetSessionActionForegroundProxy,
} from "../../../../sign/password/resetSession/start/main/worker/foreground"
import {
    newPasswordResetRegisterActionForegroundProxy,
    RegisterActionForegroundProxy,
} from "../../../../sign/password/resetSession/register/main/worker/foreground"

import { ForegroundMessage, BackgroundMessage } from "./message"
import {
    AuthenticatePasswordProxy,
    newAuthSignPasswordAuthenticateProxy,
} from "../../resources/Password/Authenticate/main/worker/foreground"

export function newLoginAsWorkerForeground(): AuthSignEntryPoint {
    const worker = newWorker()

    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const foreground = {
        continuousRenew: newContinuousRenewAuthnInfoAction_legacy(webStorage),

        location: newAuthLocationAction_legacy(),

        form: {
            core: initFormAction(),
            loginID: initLoginIDFormFieldAction(),
            password: initPasswordFormFieldAction(),
        },
    }

    const proxy = initProxy(webStorage, postForegroundMessage)
    const background = {
        initSession: proxy.reset.session.pod(),
        initRegister: proxy.reset.register.pod(),
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
            initPasswordResetResource({
                register: {
                    continuousRenew: newContinuousRenewAuthnInfoAction_legacy(webStorage),
                    location: newAuthLocationAction_legacy(),
                    register: initPasswordResetRegisterAction(
                        proxy.reset.register.pod(),
                        initPasswordResetRegisterActionLocationInfo(currentURL)
                    ),
                },

                form: formMaterial(),
            }),
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
    password: Readonly<{
        authenticate: AuthenticatePasswordProxy
    }>
    reset: Readonly<{
        session: PasswordResetSessionActionForegroundProxy
        register: RegisterActionForegroundProxy
    }>
}>
function initProxy(webStorage: Storage, post: Post<ForegroundMessage>): Proxy {
    return {
        password: {
            authenticate: newAuthSignPasswordAuthenticateProxy(webStorage, (message) =>
                post({ type: "password-authenticate", message })
            ),
        },
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
                case "password-authenticate":
                    proxy.password.authenticate.resolve(message.response)
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
