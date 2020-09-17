import { Infra } from "../infra"

import {
    PasswordResetAction,
    PasswordResetEventPublisher,
    PasswordResetEventSubscriber,
} from "../action"

import { InputContent, ResetToken, ResetEvent } from "../data"

import { LoginID } from "../../credential/data"
import { Password } from "../../password/data"
import { Content } from "../../field/data"

export function initPasswordResetAction(infra: Infra): PasswordResetAction {
    return new PasswordResetActionImpl(infra)
}

class PasswordResetActionImpl implements PasswordResetAction {
    infra: Infra

    pub: PasswordResetEventPublisher
    sub: PasswordResetEventSubscriber

    constructor(infra: Infra) {
        this.infra = infra

        const pubsub = new EventPubSub()
        this.pub = pubsub
        this.sub = pubsub
    }

    async reset(resetToken: ResetToken, fields: [Content<LoginID>, Content<Password>]): Promise<void> {
        const content = mapContent(...fields)
        if (!content.valid) {
            this.pub.publishResetEvent({ type: "failed-to-reset", content: mapInput(...fields), err: { type: "validation-error" } })
            return
        }

        this.pub.publishResetEvent({ type: "try-to-reset" })

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await delayed(
            this.infra.passwordResetClient.reset(resetToken, ...content.content),
            this.infra.timeConfig.passwordResetDelayTime,
            () => this.pub.publishResetEvent({ type: "delayed-to-reset" }),
        )
        if (!response.success) {
            this.pub.publishResetEvent({ type: "failed-to-reset", content: mapInput(...fields), err: response.err })
            return
        }

        this.pub.publishResetEvent({ type: "succeed-to-reset", authCredential: response.authCredential })
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
        function mapInput(loginID: Content<LoginID>, password: Content<Password>): InputContent {
            return {
                loginID: loginID.input,
                password: password.input,
            }
        }
    }
}

class EventPubSub implements PasswordResetEventPublisher, PasswordResetEventSubscriber {
    holder: {
        reset: PublisherHolder<ResetEvent>
    }

    constructor() {
        this.holder = {
            reset: { set: false },
        }
    }

    onResetEvent(pub: Publisher<ResetEvent>): void {
        this.holder.reset = { set: true, pub }
    }

    publishResetEvent(event: ResetEvent): void {
        if (this.holder.reset.set) {
            this.holder.reset.pub(event)
        }
    }
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

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (status: T): void
}
