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
    PollingStatusProxyMessage,
    ResetProxyMessage,
} from "./data"

import { AppHrefFactory } from "../../../href/data"
import { AuthViewFactory } from "../../view"

import { RenewCredentialComponentFactory } from "../../component/renew_credential/component"
import { PasswordLoginComponentFactory } from "../../component/password_login/component"
import { PasswordResetSessionComponentFactory } from "../../component/password_reset_session/component"
import { PasswordResetComponentFactory } from "../../component/password_reset/component"

import { LoginIDFieldComponentFactory } from "../../component/field/login_id/component"
import { PasswordFieldComponentFactory } from "../../component/field/password/component"

import { SecureScriptPathAction } from "../../../application/action"
import { RenewAction, SetContinuousRenewAction, StoreAction } from "../../../credential/action"

import { Login, LoginAction, LoginCollector } from "../../../password_login/action"
import {
    PollingStatusAction,
    Reset,
    ResetAction,
    ResetCollector,
    StartSession,
    StartSessionAction,
    StartSessionCollector,
} from "../../../password_reset/action"

import { LoginIDFieldAction } from "../../../login_id/field/action"
import { PasswordFieldAction } from "../../../password/field/action"
import { LoginEvent } from "../../../password_login/data"
import { PollingStatusEvent, ResetEvent, StartSessionEvent } from "../../../password_reset/data"

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
    resolve({ handlerID, done: release, response }: ProxyResponse<E>): void {
        if (!this.map[handlerID]) {
            throw new Error("handler is not set")
        }

        this.map[handlerID](response)

        if (release) {
            delete this.map[handlerID]
        }
    }
}
class LoginProxyMap extends ProxyMap<LoginProxyMessage, LoginEvent> {
    init(collector: LoginCollector): LoginAction {
        return async (post) => {
            this.post({
                handlerID: this.register(post),
                message: { content: await collector() },
            })
        }
    }
}
class StartSessionProxyMap extends ProxyMap<StartSessionProxyMessage, StartSessionEvent> {
    init(collector: StartSessionCollector): StartSessionAction {
        return async (post) => {
            this.post({
                handlerID: this.register(post),
                message: { content: await collector() },
            })
        }
    }
}
class PollingStatusProxyMap extends ProxyMap<PollingStatusProxyMessage, PollingStatusEvent> {
    init(): PollingStatusAction {
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
        return async (resetToken, post) => {
            this.post({
                handlerID: this.register(post),
                message: { resetToken, content: await collector() },
            })
        }
    }
}

export type ForegroundFactorySet = Readonly<{
    actions: Readonly<{
        application: Readonly<{
            secureScriptPath: Factory<SecureScriptPathAction>
        }>
        credential: Readonly<{
            renew: Factory<RenewAction>
            setContinuousRenew: Factory<SetContinuousRenewAction>
            store: Factory<StoreAction>
        }>

        field: Readonly<{
            loginID: Factory<LoginIDFieldAction>
            password: Factory<PasswordFieldAction>
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

export function initAuthViewFactoryAsForeground(
    worker: Worker,
    factory: ForegroundFactorySet
): AuthViewFactory {
    return (currentLocation) => {
        const map = initAuthProxyMapSet(postForegroundMessage)
        const view = new View(currentLocation, initAuthComponentFactorySet(factory, map))
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
        pollingStatus: PollingStatusProxyMap
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
            pollingStatus: new PollingStatusProxyMap((message) => {
                post({ type: "pollingStatus", message })
            }),
            reset: new ResetProxyMap((message) => {
                post({ type: "reset", message })
            }),
        },
    }
}
function initAuthComponentFactorySet(
    foregroundFactory: ForegroundFactorySet,
    map: AuthProxyMapSet
): AuthComponentFactorySet {
    const factory = {
        actions: { ...foregroundFactory.actions, ...initActionProxyFactory() },
        components: foregroundFactory.components,
    }

    return {
        renewCredential: (param, setup) => initRenewCredentialComponentSet(factory, param, setup),

        passwordLogin: (param) => initPasswordLoginComponentSet(factory, param),
        passwordResetSession: () => initPasswordResetSessionComponentSet(factory),
        passwordReset: (param) => initPasswordResetComponentSet(factory, param),
    }

    type ActionProxyFactorySet = Readonly<{
        passwordLogin: Readonly<{
            login: Login
        }>
        passwordReset: Readonly<{
            startSession: StartSession
            pollingStatus: Factory<PollingStatusAction>
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
                pollingStatus: () => map.passwordReset.pollingStatus.init(),
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

                case "pollingStatus":
                    map.passwordReset.pollingStatus.resolve(message.response)
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
interface Factory<T> {
    (): T
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
