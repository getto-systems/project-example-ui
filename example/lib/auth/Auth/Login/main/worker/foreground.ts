import { initAuthClient } from "../../../../../z_external/api/authClient"

import { env } from "../../../../../y_environment/env"

import {
    newApplicationActionConfig,
    newRenewActionConfig,
    newSetContinuousRenewActionConfig,
} from "../config"

import { initLoginLink } from "../link"

import {
    View,
    LoginResourceFactory,
    LoginViewCollector,
    initRenewCredentialResource,
    initPasswordLoginResource,
    initPasswordResetSessionResource,
    initPasswordResetResource,
    RenewCredentialCollector,
    PasswordLoginCollector,
    PasswordResetCollector,
} from "../../impl/core"

import { initRenewCredentialComponent } from "../../../renewCredential/impl"
import { initPasswordLoginComponent, initPasswordLoginFormComponent } from "../../../passwordLogin/impl"
import { initPasswordResetSessionComponent } from "../../../passwordResetSession/impl"
import { initPasswordResetComponent } from "../../../passwordReset/impl"

import { initLoginIDFieldComponent } from "../../../field/loginID/impl"
import { initPasswordFieldComponent } from "../../../field/password/impl"

import { initApplicationAction } from "../action/application"
import { initFormAction } from "../../../../../sub/getto-form/main/form"
import { initLoginIDFormFieldAction, initPasswordFormFieldAction } from "../action/form"
import {
    initAuthCredentialStorage,
    initRenewAction,
    initSetContinuousRenewAction,
} from "../action/renew"

import { loginIDField } from "../../../../common/field/loginID/impl/core"
import { passwordField } from "../../../../common/field/password/impl/core"

import { initAuthCredentialRepository } from "../../../../login/renew/impl/repository/authCredential"
import { currentPagePathname, detectViewState, detectResetToken } from "../../impl/location"

import { LoginLinkFactory } from "../../../link"

import { LoginEntryPoint } from "../../entryPoint"
import { RenewCredentialComponentFactory } from "../../../renewCredential/component"
import {
    PasswordLoginComponentFactory,
    PasswordLoginFormComponentFactory,
} from "../../../passwordLogin/component"
import { PasswordResetSessionComponentFactory } from "../../../passwordResetSession/component"
import { PasswordResetComponentFactory } from "../../../passwordReset/component"
import { LoginIDFieldComponentFactory } from "../../../field/loginID/component"
import { PasswordFieldComponentFactory } from "../../../field/password/component"

import { ApplicationAction } from "../../../../common/application/action"
import { FormAction } from "../../../../../sub/getto-form/action/action"
import { RenewAction, SetContinuousRenewAction } from "../../../../login/renew/action"
import { Login, LoginCollector, PasswordLoginAction } from "../../../../login/passwordLogin/action"
import {
    PasswordResetAction,
    PasswordResetSessionAction,
    StartSession,
    StartSessionCollector,
    CheckStatus,
    Reset,
    ResetCollector,
} from "../../../../profile/passwordReset/action"
import { LoginIDFieldAction, LoginIDFormFieldAction } from "../../../../common/field/loginID/action"
import { PasswordFieldAction, PasswordFormFieldAction } from "../../../../common/field/password/action"

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
    const credentialStorage = localStorage
    const currentURL = new URL(location.toString())

    const authClient = initAuthClient(env.authServerURL)

    const worker = new Worker(`/${env.version}/auth/login.worker.js`)

    const authCredentials = initAuthCredentialRepository(
        initAuthCredentialStorage(env.storageKey, credentialStorage)
    )

    const factory: ForegroundFactory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(newApplicationActionConfig()),
            renew: initRenewAction(newRenewActionConfig(), authCredentials, authClient),
            setContinuousRenew: initSetContinuousRenewAction(
                newSetContinuousRenewActionConfig(),
                authCredentials,
                authClient
            ),

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
                password: initPasswordFormFieldAction(),
            },

            field: {
                loginID: () => loginIDField(),
                password: () => passwordField(),
            },
        },
        components: {
            renewCredential: initRenewCredentialComponent,

            passwordLogin: { core: initPasswordLoginComponent, form: initPasswordLoginFormComponent },
            passwordResetSession: initPasswordResetSessionComponent,
            passwordReset: initPasswordResetComponent,

            field: {
                loginID: initLoginIDFieldComponent,
                password: initPasswordFieldComponent,
            },
        },
    }

    const collector: Collector = {
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

    return initLoginAsForeground(worker, factory, collector)
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
    init(collector: LoginCollector): Login {
        return async (post) => {
            this.post({
                handlerID: this.register(post),
                message: { content: await collector.getFields() },
            })
        }
    }
}
class StartSessionProxyMap extends ProxyMap<StartSessionProxyMessage, StartSessionEvent> {
    init(collector: StartSessionCollector): StartSession {
        return async (post) => {
            this.post({
                handlerID: this.register(post),
                message: { content: await collector.getFields() },
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
    init(collector: ResetCollector): Reset {
        return async (post) => {
            this.post({
                handlerID: this.register(post),
                message: {
                    resetToken: collector.getResetToken(),
                    content: await collector.getFields(),
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
        field: LoginIDFieldAction & PasswordFieldAction
    }>
    components: Readonly<{
        renewCredential: RenewCredentialComponentFactory

        passwordLogin: Readonly<{
            core: PasswordLoginComponentFactory
            form: PasswordLoginFormComponentFactory
        }>
        passwordResetSession: PasswordResetSessionComponentFactory
        passwordReset: PasswordResetComponentFactory

        field: Readonly<{
            loginID: LoginIDFieldComponentFactory
            password: PasswordFieldComponentFactory
        }>
    }>
}>
type Collector = LoginViewCollector &
    RenewCredentialCollector &
    PasswordLoginCollector &
    PasswordResetCollector

function initLoginAsForeground(
    worker: Worker,
    factory: ForegroundFactory,
    collector: Collector
): LoginEntryPoint {
    const map = initProxy(postForegroundMessage)
    const view = new View(collector, initLoginComponentFactory(factory, collector, map))
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
    collector: Collector,
    proxy: Proxy
): LoginResourceFactory {
    const factory = {
        ...foregroundFactory,
        actions: { ...foregroundFactory.actions, ...initActionProxyFactory() },
    }

    return {
        renewCredential: (setup) => initRenewCredentialResource(factory, collector, setup),

        passwordLogin: () => initPasswordLoginResource(factory, collector),
        passwordResetSession: () => initPasswordResetSessionResource(factory),
        passwordReset: () => initPasswordResetResource(factory, collector),
    }

    type ActionProxyFactory = Readonly<{
        passwordLogin: PasswordLoginAction
        passwordResetSession: PasswordResetSessionAction
        passwordReset: PasswordResetAction
    }>

    function initActionProxyFactory(): ActionProxyFactory {
        return {
            passwordLogin: {
                login: (collector) => proxy.passwordLogin.login.init(collector),
            },
            passwordResetSession: {
                startSession: (collector) => proxy.passwordResetSession.startSession.init(collector),
                checkStatus: () => proxy.passwordResetSession.checkStatus.init(),
            },
            passwordReset: {
                reset: (collector) => proxy.passwordReset.reset.init(collector),
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
