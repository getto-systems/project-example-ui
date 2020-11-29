import { View, AuthComponentFactorySet } from "../view"
import {
    initRenewCredentialComponentSet,
    initPasswordLoginComponentSet,
    initPasswordResetSessionComponentSet,
    initPasswordResetComponentSet,
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

import { AppHrefFactory } from "../../../../Href/data"
import { LoginState, AuthViewFactory } from "../../view"

import { RenewCredentialComponentFactory } from "../../../renew_credential/component"
import { PasswordLoginComponentFactory } from "../../../password_login/component"
import { PasswordResetSessionComponentFactory } from "../../../password_reset_session/component"
import { PasswordResetComponentFactory } from "../../../password_reset/component"

import { LoginIDFieldComponentFactory } from "../../../field/login_id/component"
import { PasswordFieldComponentFactory } from "../../../field/password/component"

import { SecureScriptPath } from "../../../../application/action"
import { Renew, SetContinuousRenew, Store } from "../../../../credential/action"

import { Login, LoginAction, LoginCollector } from "../../../../password_login/action"
import {
    StartSession,
    StartSessionAction,
    StartSessionCollector,
    CheckStatus,
    CheckStatusAction,
    Reset,
    ResetAction,
    ResetCollector,
} from "../../../../password_reset/action"

import { PagePathname } from "../../../../application/data"
import { LoginIDField } from "../../../../login_id/field/action"
import { PasswordField } from "../../../../password/field/action"
import { LoginEvent } from "../../../../password_login/data"
import {
    ResetToken,
    StartSessionEvent,
    CheckStatusEvent,
    ResetEvent,
} from "../../../../password_reset/data"

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

export type ForegroundFactorySet = Readonly<{
    actions: Readonly<{
        application: Readonly<{
            secureScriptPath: SecureScriptPath
        }>
        credential: Readonly<{
            renew: Renew
            setContinuousRenew: SetContinuousRenew
            store: Store
        }>

        field: Readonly<{
            loginID: LoginIDField
            password: PasswordField
        }>
    }>
    components: Readonly<{
        href: AppHrefFactory

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
export type CollectorSet = Readonly<{
    auth: Readonly<{
        getLoginView(): LoginState
    }>
    application: Readonly<{
        getPagePathname(): PagePathname
    }>
    passwordReset: Readonly<{
        getResetToken(): ResetToken
    }>
}>

export function initAuthViewFactoryAsForeground(
    worker: Worker,
    factory: ForegroundFactorySet,
    collector: CollectorSet
): AuthViewFactory {
    return () => {
        const map = initAuthProxyMapSet(postForegroundMessage)
        const view = new View(collector, initAuthComponentFactorySet(factory, collector, map))
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
}
type AuthProxyMapSet = Readonly<{
    passwordLogin: Readonly<{
        login: LoginProxyMap
    }>
    passwordReset: Readonly<{
        startSession: StartSessionProxyMap
        checkStatus: CheckStatusProxyMap
        reset: ResetProxyMap
    }>
}>
function initAuthProxyMapSet(post: Post<ForegroundMessage>): AuthProxyMapSet {
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
function initAuthComponentFactorySet(
    foregroundFactory: ForegroundFactorySet,
    collector: CollectorSet,
    map: AuthProxyMapSet
): AuthComponentFactorySet {
    const factory = {
        actions: { ...foregroundFactory.actions, ...initActionProxyFactory() },
        components: foregroundFactory.components,
    }

    return {
        renewCredential: (setup) => initRenewCredentialComponentSet(factory, collector, setup),

        passwordLogin: () => initPasswordLoginComponentSet(factory, collector),
        passwordResetSession: () => initPasswordResetSessionComponentSet(factory),
        passwordReset: () => initPasswordResetComponentSet(factory, collector),
    }

    type ActionProxyFactorySet = Readonly<{
        passwordLogin: Readonly<{
            login: Login
        }>
        passwordReset: Readonly<{
            startSession: StartSession
            checkStatus: CheckStatus
            reset: Reset
        }>
    }>

    function initActionProxyFactory(): ActionProxyFactorySet {
        return {
            passwordLogin: {
                login: (collector) => map.passwordLogin.login.init(collector),
            },
            passwordReset: {
                startSession: (collector) => map.passwordReset.startSession.init(collector),
                checkStatus: () => map.passwordReset.checkStatus.init(),
                reset: (collector) => map.passwordReset.reset.init(collector),
            },
        }
    }
}
function initBackgroundMessageHandler(
    map: AuthProxyMapSet,
    errorHandler: Post<string>
): Post<BackgroundMessage> {
    return (message) => {
        try {
            switch (message.type) {
                case "login":
                    map.passwordLogin.login.resolve(message.response)
                    break

                case "startSession":
                    map.passwordReset.startSession.resolve(message.response)
                    break

                case "checkStatus":
                    map.passwordReset.checkStatus.resolve(message.response)
                    break

                case "reset":
                    map.passwordReset.reset.resolve(message.response)
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
