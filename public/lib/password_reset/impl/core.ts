import { Infra, TimeConfig, PasswordResetSessionClient } from "../infra"

import {
    PasswordResetAction,
    PasswordResetEventPublisher,
    PasswordResetEventSubscriber,
} from "../action"

import {
    CreateSessionInputContent, ResetInputContent,
    Session, CreateSessionEvent, PollingStatusEvent, PollingStatusError,
    ResetToken, ResetEvent,
} from "../data"

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

    async createSession(fields: [Content<LoginID>]): Promise<void> {
        const content = mapContent(...fields)
        if (!content.valid) {
            this.pub.publishCreateSessionEvent({
                type: "failed-to-create-session",
                content: mapInput(...fields),
                err: { type: "validation-error" },
            })
            return
        }

        this.pub.publishCreateSessionEvent({ type: "try-to-create-session" })

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await delayed(
            this.infra.passwordResetSessionClient.createSession(...content.content),
            this.infra.timeConfig.passwordResetCreateSessionDelayTime,
            () => this.pub.publishCreateSessionEvent({ type: "delayed-to-create-session" }),
        )
        if (!response.success) {
            this.pub.publishCreateSessionEvent({
                type: "failed-to-create-session",
                content: mapInput(...fields),
                err: response.err,
            })
            return
        }

        this.pub.publishCreateSessionEvent({
            type: "succeed-to-create-session",
            session: response.session,
        })

        return

        type ValidContent =
            Readonly<{ valid: false }> |
            Readonly<{ valid: true, content: [LoginID] }>

        function mapContent(loginID: Content<LoginID>): ValidContent {
            if (!loginID.valid) {
                return { valid: false }
            }
            return { valid: true, content: [loginID.content] }
        }
        function mapInput(loginID: Content<LoginID>): CreateSessionInputContent {
            return {
                loginID: loginID.input,
            }
        }
    }

    async startPollingStatus(session: Session): Promise<void> {
        new StatusPoller(this.infra.timeConfig, this.infra.passwordResetSessionClient, this.pub).startPolling(session)
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
        function mapInput(loginID: Content<LoginID>, password: Content<Password>): ResetInputContent {
            return {
                loginID: loginID.input,
                password: password.input,
            }
        }
    }
}

type SendTokenState =
    Readonly<{ type: "initial" }> |
    Readonly<{ type: "failed", err: PollingStatusError }> |
    Readonly<{ type: "success" }>

class StatusPoller {
    timeConfig: TimeConfig
    client: PasswordResetSessionClient
    pub: PasswordResetEventPublisher

    sendTokenState: SendTokenState

    constructor(timeConfig: TimeConfig, client: PasswordResetSessionClient, pub: PasswordResetEventPublisher) {
        this.timeConfig = timeConfig
        this.client = client
        this.pub = pub

        this.sendTokenState = { type: "initial" }
    }

    async startPolling(session: Session): Promise<void> {
        this.pub.publishPollingStatusEvent({ type: "try-to-polling-status" })

        this.sendToken()

        let count = 0

        while (count < this.timeConfig.passwordResetPollingLimit.limit) {
            count += 1

            if (this.sendTokenState.type === "failed") {
                this.pub.publishPollingStatusEvent({ type: "failed-to-polling-status", err: this.sendTokenState.err })
                return
            }

            const response = await this.client.getStatus(session)
            if (!response.success) {
                this.pub.publishPollingStatusEvent({ type: "failed-to-polling-status", err: response.err })
                return
            }

            if (response.done) {
                this.pub.publishPollingStatusEvent({ type: "succeed-to-send-token", status: response.status })
                return
            }

            this.pub.publishPollingStatusEvent({ type: "retry-to-polling-status", status: response.status })

            await wait(this.timeConfig.passwordResetPollingWaitTime)
        }

        this.pub.publishPollingStatusEvent({
            type: "failed-to-polling-status",
            err: { type: "infra-error", err: "overflow polling limit" },
        })
    }

    async sendToken(): Promise<void> {
        const response = await this.client.sendToken()
        if (!response.success) {
            this.sendTokenState = { type: "failed", err: response.err }
            return
        }
        this.sendTokenState = { type: "success" }
    }
}

class EventPubSub implements PasswordResetEventPublisher, PasswordResetEventSubscriber {
    holder: {
        createSession: PublisherHolder<CreateSessionEvent>
        pollingStatus: PublisherHolder<PollingStatusEvent>
        reset: PublisherHolder<ResetEvent>
    }

    constructor() {
        this.holder = {
            createSession: { set: false },
            pollingStatus: { set: false },
            reset: { set: false },
        }
    }

    onCreateSessionEvent(pub: Publisher<CreateSessionEvent>): void {
        this.holder.createSession = { set: true, pub }
    }
    onPollingStatusEvent(pub: Publisher<PollingStatusEvent>): void {
        this.holder.pollingStatus = { set: true, pub }
    }
    onResetEvent(pub: Publisher<ResetEvent>): void {
        this.holder.reset = { set: true, pub }
    }

    publishCreateSessionEvent(event: CreateSessionEvent): void {
        if (this.holder.createSession.set) {
            this.holder.createSession.pub(event)
        }
    }
    publishPollingStatusEvent(event: PollingStatusEvent): void {
        if (this.holder.pollingStatus.set) {
            this.holder.pollingStatus.pub(event)
        }
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

function wait(time: WaitTime): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time.wait_milli_second)
    })
}

type DelayTime = { delay_milli_second: number }
type WaitTime = { wait_milli_second: number }

interface DelayedHandler {
    (): void
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (status: T): void
}
