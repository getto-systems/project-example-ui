import { env } from "../../../../../../y_environment/env"

import { initLoginLink } from "../link"

import { View, LoginResourceFactory, LoginViewLocationInfo } from "../../impl/core"
import { initRenewCredentialResource, RenewCredentialLocationInfo } from "../../impl/renew"
import { initPasswordLoginResource, PasswordLoginLocationInfo } from "../../impl/login"
import {
    initPasswordResetResource,
    initPasswordResetSessionResource,
    PasswordResetLocationInfo,
} from "../../impl/reset"

import { initRenewCredentialComponent } from "../../../renewCredential/impl"
import { initPasswordLoginComponent, initPasswordLoginFormComponent } from "../../../passwordLogin/impl"
import {
    initPasswordResetSessionComponent,
    initPasswordResetSessionFormComponent,
} from "../../../passwordResetSession/impl"
import { initPasswordResetComponent, initPasswordResetFormComponent } from "../../../passwordReset/impl"

import { initApplicationAction } from "../action/application"
import { initFormAction } from "../../../../../../sub/getto-form/main/form"
import { initLoginIDFormFieldAction, initPasswordFormFieldAction } from "../action/form"
import { initRenewAction, initSetContinuousRenewAction } from "../action/renew"

import { currentPagePathname, detectViewState, detectResetToken } from "../../impl/location"

import { LoginLinkFactory } from "../../../link"

import { LoginEntryPoint } from "../../entryPoint"
import { RenewCredentialComponentFactory } from "../../../renewCredential/component"
import {
    PasswordLoginComponentFactory,
    PasswordLoginFormComponentFactory,
} from "../../../passwordLogin/component"
import {
    PasswordResetSessionComponentFactory,
    PasswordResetSessionFormComponentFactory,
} from "../../../passwordResetSession/component"
import {
    PasswordResetComponentFactory,
    PasswordResetFormComponentFactory,
} from "../../../passwordReset/component"

import { ApplicationAction } from "../../../../../common/application/action"
import { FormAction } from "../../../../../../sub/getto-form/form/action"
import { RenewAction, SetContinuousRenewAction } from "../../../../../login/credentialStore/action"
import { Login, PasswordLoginAction } from "../../../../../login/passwordLogin/action"
import {
    PasswordResetAction,
    PasswordResetSessionAction,
    StartSession,
    CheckStatus,
    Reset,
    ResetLocationInfo,
} from "../../../../../profile/passwordReset/action"
import { LoginIDFormFieldAction } from "../../../../../common/field/loginID/action"
import { PasswordFormFieldAction } from "../../../../../common/field/password/action"

import { LoginEvent } from "../../../../../login/passwordLogin/event"
import {
    StartSessionEvent,
    CheckStatusEvent,
    ResetEvent,
} from "../../../../../profile/passwordReset/event"

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
    const credentialStorage = localStorage
    const currentURL = new URL(location.toString())

    const worker = new Worker(`/${env.version}/auth/login.worker.js`)

    const factory: ForegroundFactory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(),
            renew: initRenewAction(credentialStorage),
            setContinuousRenew: initSetContinuousRenewAction(credentialStorage),

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
                password: initPasswordFormFieldAction(),
            },
        },
        components: {
            renewCredential: initRenewCredentialComponent,

            passwordLogin: { core: initPasswordLoginComponent, form: initPasswordLoginFormComponent },
            passwordResetSession: {
                core: initPasswordResetSessionComponent,
                form: initPasswordResetSessionFormComponent,
            },
            passwordReset: { core: initPasswordResetComponent, form: initPasswordResetFormComponent },
        },
    }

    const locationInfo: LocationInfo = {
        login: {
            getLoginView: () => detectViewState(currentURL),
        },
        application: {
            getPagePathname: () => currentPagePathname(currentURL),
        },
        passwordReset: {
            getResetToken: () => detectResetToken(currentURL),
        },
    }

    return initLoginAsForeground(worker, factory, locationInfo)
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

type ForegroundFactory = Readonly<{
    link: LoginLinkFactory
    actions: Readonly<{
        application: ApplicationAction
        renew: RenewAction
        setContinuousRenew: SetContinuousRenewAction

        form: Readonly<{
            core: FormAction
            loginID: LoginIDFormFieldAction
            password: PasswordFormFieldAction
        }>
    }>
    components: Readonly<{
        renewCredential: RenewCredentialComponentFactory

        passwordLogin: Readonly<{
            core: PasswordLoginComponentFactory
            form: PasswordLoginFormComponentFactory
        }>
        passwordResetSession: Readonly<{
            core: PasswordResetSessionComponentFactory
            form: PasswordResetSessionFormComponentFactory
        }>
        passwordReset: Readonly<{
            core: PasswordResetComponentFactory
            form: PasswordResetFormComponentFactory
        }>
    }>
}>
type LocationInfo = LoginViewLocationInfo &
    RenewCredentialLocationInfo &
    PasswordLoginLocationInfo &
    PasswordResetLocationInfo

function initLoginAsForeground(
    worker: Worker,
    factory: ForegroundFactory,
    locationInfo: LocationInfo
): LoginEntryPoint {
    const map = initProxy(postForegroundMessage)
    const view = new View(locationInfo, initLoginComponentFactory(factory, locationInfo, map))
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
    foregroundFactory: ForegroundFactory,
    locationInfo: LocationInfo,
    proxy: Proxy
): LoginResourceFactory {
    const factory = {
        ...foregroundFactory,
        actions: { ...foregroundFactory.actions, ...initActionProxyFactory() },
    }

    return {
        renewCredential: (setup) => initRenewCredentialResource(factory, locationInfo, setup),

        passwordLogin: () => initPasswordLoginResource(factory, locationInfo),
        passwordResetSession: () => initPasswordResetSessionResource(factory),
        passwordReset: () => initPasswordResetResource(factory, locationInfo),
    }

    type ActionProxyFactory = Readonly<{
        passwordLogin: PasswordLoginAction
        passwordResetSession: PasswordResetSessionAction
        passwordReset: PasswordResetAction
    }>

    function initActionProxyFactory(): ActionProxyFactory {
        return {
            passwordLogin: {
                login: () => proxy.passwordLogin.login.init(),
            },
            passwordResetSession: {
                startSession: () => proxy.passwordResetSession.startSession.init(),
                checkStatus: () => proxy.passwordResetSession.checkStatus.init(),
            },
            passwordReset: {
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
