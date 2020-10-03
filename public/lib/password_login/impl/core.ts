import { Infra } from "../infra"

import { PasswordLoginInit, PasswordLoginEventMapper } from "../action"

import { LoginContent, LoginFields, PasswordLoginEvent, LoginEvent } from "../data"
import { Content, validContent, invalidContent } from "../../field/data"

type LoginOperation = Readonly<{
    content: LoginContent
}>
async function login({ content }: LoginOperation, infra: Infra, post: Post<LoginEvent>): Promise<void> {
    const fields = mapContent(content)
    if (!fields.valid) {
        post({ type: "failed-to-login", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-login" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await infra.delayed(
        infra.passwordLoginClient.login(fields.content.loginID, fields.content.password),
        infra.timeConfig.passwordLoginDelayTime,
        () => post({ type: "delayed-to-login" }),
    )
    if (!response.success) {
        post({ type: "failed-to-login", err: response.err })
        return
    }

    post({ type: "succeed-to-login", authCredential: response.authCredential })
}

function mapContent(content: LoginContent): Content<LoginFields> {
    if (
        !content.loginID.valid ||
        !content.password.valid
    ) {
        return invalidContent()
    }
    return validContent({
        loginID: content.loginID.content,
        password: content.password.content,
    })
}

export function initPasswordLoginInit(infra: Infra): PasswordLoginInit {
    return (setup) => {
        const pubsub = new EventPubSub()
        setup(pubsub)

        return {
            request: (operation) => {
                switch (operation.type) {
                    case "login":
                        login(operation, infra, event => pubsub.postLoginEvent(event))
                        return
                }
            },
            terminate: () => { /* worker とインターフェイスを合わせるため */ },
        }
    }
}

export function initWorkerPasswordLoginInit(initWorker: Init<Worker>): PasswordLoginInit {
    return (setup) => {
        const pubsub = new EventPubSub()
        setup(pubsub)

        const worker = initWorker()

        worker.addEventListener("message", (event) => {
            const state = event.data as PasswordLoginEvent
            switch (state.type) {
                case "login":
                    pubsub.postLoginEvent(state.event)
                    return
            }
        })

        return {
            request: operation => worker.postMessage(operation),
            terminate: () => worker.terminate(),
        }
    }
}

export function initPasswordLoginEventMapper(): PasswordLoginEventMapper {
    return {
        mapLoginEvent,
    }
}
function mapLoginEvent(event: LoginEvent): PasswordLoginEvent {
    return { type: "login", event }
}

class EventPubSub {
    listener: Readonly<{
        login: Post<LoginEvent>[]
    }>

    constructor() {
        this.listener = {
            login: [],
        }
    }

    postLoginEvent(event: LoginEvent): void {
        this.listener.login.forEach(post => post(event))
    }

    onLoginEvent(post: Post<LoginEvent>): void {
        this.listener.login.push(post)
    }
}

interface Post<T> {
    (event: T): void
}
interface Init<T> {
    (): T
}
