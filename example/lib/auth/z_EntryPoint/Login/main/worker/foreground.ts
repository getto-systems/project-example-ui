import { env } from "../../../../../y_environment/env"

import { View, LoginResourceFactory } from "../../impl/core"
import { initLoginViewLocationInfo } from "../../impl/location"
import { initLoginLocationInfo } from "../../../../x_Resource/common/LocationInfo/impl"

import { initLoginLinkResource } from "../../../../x_Resource/common/LoginLink/impl"
import { initPasswordLoginResource } from "../../../../x_Resource/Login/PasswordLogin/impl"
import { initPasswordResetResource } from "../../../../x_Resource/Profile/PasswordReset/impl"
import { initPasswordResetSessionResource } from "../../../../x_Resource/Profile/PasswordResetSession/impl"
import { initRenewCredentialResource } from "../../../../x_Resource/Login/RenewCredential/impl"

import { initApplicationAction } from "../../../../common/application/main/application"
import { initFormAction } from "../../../../../sub/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../common/field/password/main/password"
import {
    initRenewAction,
    initSetContinuousRenewAction,
} from "../../../../login/credentialStore/main/renew"

import { LoginBackgroundAction, LoginEntryPoint, LoginForegroundAction } from "../../entryPoint"
import { LoginLocationInfo } from "../../../../x_Resource/common/LocationInfo/locationInfo"

import { Login } from "../../../../login/passwordLogin/action"
import {
    StartSession,
    CheckStatus,
    Reset,
    ResetLocationInfo,
} from "../../../../profile/passwordReset/action"

import { LoginEvent } from "../../../../login/passwordLogin/event"
import { StartSessionEvent, CheckStatusEvent, ResetEvent } from "../../../../profile/passwordReset/event"

import {
    ForegroundMessage,
    BackgroundMessage,
    ProxyMessage,
    ProxyResponse,
    LoginProxyMessage,
    StartSessionProxyMessage,
    CheckStatusProxyMessage,
    ResetProxyMessage,
} from "./message"

export function newLoginAsWorkerForeground(): LoginEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const worker = new Worker(`/${env.version}/auth/login.worker.js`)

    const foreground: LoginForegroundAction = {
        application: initApplicationAction(),
        renew: initRenewAction(webStorage),
        setContinuousRenew: initSetContinuousRenewAction(webStorage),

        form: {
            core: initFormAction(),
            loginID: initLoginIDFormFieldAction(),
            password: initPasswordFormFieldAction(),
        },
    }

    const map = initProxy(postForegroundMessage)
    const view = new View(
        initLoginViewLocationInfo(currentURL),
        initLoginComponentFactory(initLoginLocationInfo(currentURL), foreground, map)
    )
    const errorHandler = (err: string) => {
        view.error(err)
    }
    const messageHandler = initBackgroundMessageHandler(map, errorHandler)

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

class ProxyMap<M, E> {
    idGenerator: IDGenerator
    post: Post<ProxyMessage<M>>

    map: Record<number, Post<E>> = {}

    constructor(post: Post<ProxyMessage<M>>) {
        this.idGenerator = new IDGenerator()
        this.post = post
    }

    register(post: Post<E>): number {
        const handlerID = this.idGenerator.generate()
        this.map[handlerID] = post
        return handlerID
    }
    resolve({ handlerID, done, response }: ProxyResponse<E>): void {
        if (!this.map[handlerID]) {
            throw new Error("handler is not set")
        }

        this.map[handlerID](response)

        if (done) {
            delete this.map[handlerID]
        }
    }
}
class LoginProxyMap extends ProxyMap<LoginProxyMessage, LoginEvent> {
    init(): Login {
        return async (fields, post) => {
            this.post({
                handlerID: this.register(post),
                message: { fields },
            })
        }
    }
}
class StartSessionProxyMap extends ProxyMap<StartSessionProxyMessage, StartSessionEvent> {
    init(): StartSession {
        return async (fields, post) => {
            this.post({
                handlerID: this.register(post),
                message: { fields },
            })
        }
    }
}
class CheckStatusProxyMap extends ProxyMap<CheckStatusProxyMessage, CheckStatusEvent> {
    init(): CheckStatus {
        return async (sessionID, post) => {
            this.post({
                handlerID: this.register(post),
                message: { sessionID },
            })
        }
    }
}
class ResetProxyMap extends ProxyMap<ResetProxyMessage, ResetEvent> {
    init(locationInfo: ResetLocationInfo): Reset {
        return async (fields, post) => {
            this.post({
                handlerID: this.register(post),
                message: {
                    resetToken: locationInfo.getResetToken(),
                    fields,
                },
            })
        }
    }
}

type Proxy = Readonly<{
    passwordLogin: Readonly<{
        login: LoginProxyMap
    }>
    passwordResetSession: Readonly<{
        startSession: StartSessionProxyMap
        checkStatus: CheckStatusProxyMap
    }>
    passwordReset: Readonly<{
        reset: ResetProxyMap
    }>
}>
function initProxy(post: Post<ForegroundMessage>): Proxy {
    return {
        passwordLogin: {
            login: new LoginProxyMap((message) => {
                post({ type: "login", message })
            }),
        },
        passwordResetSession: {
            startSession: new StartSessionProxyMap((message) => {
                post({ type: "startSession", message })
            }),
            checkStatus: new CheckStatusProxyMap((message) => {
                post({ type: "checkStatus", message })
            }),
        },
        passwordReset: {
            reset: new ResetProxyMap((message) => {
                post({ type: "reset", message })
            }),
        },
    }
}
function initLoginComponentFactory(
    locationInfo: LoginLocationInfo,
    foreground: LoginForegroundAction,
    proxy: Proxy
): LoginResourceFactory {
    const background = initActionProxyFactory()

    return {
        loginLink: initLoginLinkResource,

        renewCredential: (setup) => initRenewCredentialResource(setup, locationInfo, foreground),

        passwordLogin: () => initPasswordLoginResource(locationInfo, foreground, background),
        passwordResetSession: () => initPasswordResetSessionResource(foreground, background),
        passwordReset: () => initPasswordResetResource(locationInfo, foreground, background),
    }

    function initActionProxyFactory(): LoginBackgroundAction {
        return {
            login: {
                login: () => proxy.passwordLogin.login.init(),
            },
            resetSession: {
                startSession: () => proxy.passwordResetSession.startSession.init(),
                checkStatus: () => proxy.passwordResetSession.checkStatus.init(),
            },
            reset: {
                reset: (locationInfo) => proxy.passwordReset.reset.init(locationInfo),
            },
        }
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
                    proxy.passwordLogin.login.resolve(message.response)
                    break

                case "startSession":
                    proxy.passwordResetSession.startSession.resolve(message.response)
                    break

                case "checkStatus":
                    proxy.passwordResetSession.checkStatus.resolve(message.response)
                    break

                case "reset":
                    proxy.passwordReset.reset.resolve(message.response)
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

class IDGenerator {
    id = 0

    generate(): number {
        this.id += 1
        return this.id
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
