import { Infra } from "../infra"

import { PasswordLoginAction, PasswordLoginEventPublisher, PasswordLoginEventSubscriber } from "../action"

import { LoginID } from "../../login_id/data"
import { Password } from "../../password/data"
import { LoginEvent } from "../data"
import { Content } from "../../field/data"

export function initPasswordLoginAction(infra: Infra): PasswordLoginAction {
    return new Action(infra)
}

class Action implements PasswordLoginAction {
    infra: Infra

    pub: PasswordLoginEventPublisher
    sub: PasswordLoginEventSubscriber

    constructor(infra: Infra) {
        this.infra = infra

        const pubsub = new EventPubSub()
        this.pub = pubsub
        this.sub = pubsub
    }

    async login(fields: [Content<LoginID>, Content<Password>]): Promise<void> {
        const content = mapContent(...fields)
        if (!content.valid) {
            this.pub.publishLoginEvent({ type: "failed-to-login", err: { type: "validation-error" } })
            return
        }

        this.pub.publishLoginEvent({ type: "try-to-login" })

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await delayed(
            this.infra.passwordLoginClient.login(...content.content),
            this.infra.timeConfig.passwordLoginDelayTime,
            () => this.pub.publishLoginEvent({ type: "delayed-to-login" }),
        )
        if (!response.success) {
            this.pub.publishLoginEvent({ type: "failed-to-login", err: response.err })
            return
        }

        this.pub.publishLoginEvent({ type: "succeed-to-login", authCredential: response.authCredential })
        return

        type ValidContent =
            Readonly<{ valid: false }> |
            Readonly<{ valid: true, content: [LoginID, Password] }>

        function mapContent(loginID: Content<LoginID>, password: Content<Password>): ValidContent {
            if (
                !loginID.valid ||
                !password.valid
            ) {
                return { valid: false }
            }
            return { valid: true, content: [loginID.content, password.content] }
        }
    }
}

class EventPubSub implements PasswordLoginEventPublisher, PasswordLoginEventSubscriber {
    holder: {
        login: PublisherHolder<LoginEvent>
    }

    constructor() {
        this.holder = {
            login: { set: false },
        }
    }

    onLoginEvent(pub: Publisher<LoginEvent>): void {
        this.holder.login = { set: true, pub }
    }

    publishLoginEvent(event: LoginEvent): void {
        if (this.holder.login.set) {
            this.holder.login.pub(event)
        }
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}

async function delayed<T>(promise: Promise<T>, time: DelayTime, handler: DelayedHandler): Promise<T> {
    const DELAYED_MARKER = { DELAYED: true }
    const delayed = new Promise((resolve) => {
        setTimeout(() => {
            resolve(DELAYED_MARKER)
        }, time.delay_milli_second)
    })

    const winner = await Promise.race([promise, delayed])
    if (winner === DELAYED_MARKER) {
        handler()
    }

    return await promise
}

type DelayTime = { delay_milli_second: number }

interface DelayedHandler {
    (): void
}
