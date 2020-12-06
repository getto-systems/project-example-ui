import { View, LoginComponentFactory, LoginViewCollector } from "../view"
import {
    initRenewCredentialResource,
    initPasswordLoginResource,
    initPasswordResetSessionResource,
    initPasswordResetResource,
    RenewCredentialCollector,
    PasswordLoginCollector,
    PasswordResetCollector,
} from "../core"

import {
    ForegroundMessage,
    BackgroundMessage,
    ProxyMessage,
    ProxyResponse,
    LoginProxyMessage,
    StartSessionProxyMessage,
    CheckStatusProxyMessage,
    ResetProxyMessage,
} from "./data"

import { LoginEntryPoint } from "../../view"

import { LoginLinkFactory } from "../../../link"

import { RenewCredentialComponentFactory } from "../../../renew_credential/component"
import { PasswordLoginComponentFactory } from "../../../password_login/component"
import { PasswordResetSessionComponentFactory } from "../../../password_reset_session/component"
import { PasswordResetComponentFactory } from "../../../password_reset/component"

import { LoginIDFieldComponentFactory } from "../../../field/login_id/component"
import { PasswordFieldComponentFactory } from "../../../field/password/component"

import { ApplicationAction } from "../../../../common/application/action"
import { CredentialAction } from "../../../../common/credential/action"
import { Renew, SetContinuousRenew } from "../../../../login/renew/action"

import { Login, LoginAction, LoginCollector } from "../../../../login/password_login/action"
import {
    StartSession,
    StartSessionAction,
    StartSessionCollector,
    CheckStatus,
    CheckStatusAction,
    Reset,
    ResetAction,
    ResetCollector,
} from "../../../../profile/password_reset/action"

import { LoginIDFieldAction } from "../../../../common/field/login_id/action"
import { PasswordFieldAction } from "../../../../common/field/password/action"
import { LoginEvent } from "../../../../login/password_login/data"
import { StartSessionEvent, CheckStatusEvent, ResetEvent } from "../../../../profile/password_reset/data"

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
    init(collector: LoginCollector): LoginAction {
        return async (post) => {
            this.post({
                handlerID: this.register(post),
                message: { content: await collector.getFields() },
            })
        }
    }
}
class StartSessionProxyMap extends ProxyMap<StartSessionProxyMessage, StartSessionEvent> {
    init(collector: StartSessionCollector): StartSessionAction {
        return async (post) => {
            this.post({
                handlerID: this.register(post),
                message: { content: await collector.getFields() },
            })
        }
    }
}
class CheckStatusProxyMap extends ProxyMap<CheckStatusProxyMessage, CheckStatusEvent> {
    init(): CheckStatusAction {
        return async (sessionID, post) => {
            this.post({
                handlerID: this.register(post),
                message: { sessionID },
            })
        }
    }
}
class ResetProxyMap extends ProxyMap<ResetProxyMessage, ResetEvent> {
    init(collector: ResetCollector): ResetAction {
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

export type ForegroundFactory = Readonly<{
    link: LoginLinkFactory
    actions: Readonly<{
        application: ApplicationAction
        // TODO renew に分ける
        credential: Readonly<{
            renew: Renew
            setContinuousRenew: SetContinuousRenew
        }> & CredentialAction

        field: LoginIDFieldAction & PasswordFieldAction
    }>
    components: Readonly<{
        renewCredential: RenewCredentialComponentFactory

        passwordLogin: PasswordLoginComponentFactory
        passwordResetSession: PasswordResetSessionComponentFactory
        passwordReset: PasswordResetComponentFactory

        field: Readonly<{
            loginID: LoginIDFieldComponentFactory
            password: PasswordFieldComponentFactory
        }>
    }>
}>
export type Collector = LoginViewCollector &
    RenewCredentialCollector &
    PasswordLoginCollector &
    PasswordResetCollector

export function initLoginAsForeground(
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
    }
}
type Proxy = Readonly<{
    passwordLogin: Readonly<{
        login: LoginProxyMap
    }>
    passwordReset: Readonly<{
        startSession: StartSessionProxyMap
        checkStatus: CheckStatusProxyMap
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
        passwordReset: {
            startSession: new StartSessionProxyMap((message) => {
                post({ type: "startSession", message })
            }),
            checkStatus: new CheckStatusProxyMap((message) => {
                post({ type: "checkStatus", message })
            }),
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
): LoginComponentFactory {
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
        passwordLogin: Readonly<{
            login: Login
        }>
        passwordReset: Readonly<{
            startSession: StartSession
            checkStatus: CheckStatus
            reset: Reset
        }>
    }>

    function initActionProxyFactory(): ActionProxyFactory {
        return {
            passwordLogin: {
                login: (collector) => proxy.passwordLogin.login.init(collector),
            },
            passwordReset: {
                startSession: (collector) => proxy.passwordReset.startSession.init(collector),
                checkStatus: () => proxy.passwordReset.checkStatus.init(),
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
                    proxy.passwordReset.startSession.resolve(message.response)
                    break

                case "checkStatus":
                    proxy.passwordReset.checkStatus.resolve(message.response)
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
