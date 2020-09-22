import { Infra, TimeConfig, PasswordResetSessionClient } from "../infra"

import { PasswordResetAction, PasswordResetEventPublisher, PasswordResetEventSubscriber } from "../action"

import {
    SessionID,
    CreateSessionEvent, PollingStatusEvent, PollingStatusError,
    ResetToken, ResetEvent,
} from "../data"

import { LoginID } from "../../login_id/data"
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
            this.pub.publishCreateSessionEvent({ type: "failed-to-create-session", err: { type: "validation-error" } })
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
            this.pub.publishCreateSessionEvent({ type: "failed-to-create-session", err: response.err })
            return
        }

        this.pub.publishCreateSessionEvent({ type: "succeed-to-create-session", sessionID: response.sessionID })

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
    }

    async startPollingStatus(sessionID: SessionID): Promise<void> {
        new StatusPoller(this.infra.timeConfig, this.infra.passwordResetSessionClient, this.pub).startPolling(sessionID)
    }

    async reset(resetToken: ResetToken, fields: [Content<LoginID>, Content<Password>]): Promise<void> {
        const content = mapContent(...fields)
        if (!content.valid) {
            this.pub.publishResetEvent({ type: "failed-to-reset", err: { type: "validation-error" } })
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
            this.pub.publishResetEvent({ type: "failed-to-reset", err: response.err })
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

    async startPolling(sessionID: SessionID): Promise<void> {
        this.pub.publishPollingStatusEvent({ type: "try-to-polling-status" })

        this.sendToken()

        let count = 0

        while (count < this.timeConfig.passwordResetPollingLimit.limit) {
            count += 1

            if (this.sendTokenState.type === "failed") {
                this.pub.publishPollingStatusEvent({ type: "failed-to-polling-status", err: this.sendTokenState.err })
                return
            }

            const response = await this.client.getStatus(sessionID)
            if (!response.success) {
                this.pub.publishPollingStatusEvent({ type: "failed-to-polling-status", err: response.err })
                return
            }

            if (response.done) {
                if (response.send) {
                    this.pub.publishPollingStatusEvent({ type: "succeed-to-send-token", dest: response.dest })
                } else {
                    this.pub.publishPollingStatusEvent({
                        type: "failed-to-send-token",
                        dest: response.dest,
                        err: { type: "infra-error", err: response.err },
                    })
                }
                return
            }

            this.pub.publishPollingStatusEvent({
                type: "retry-to-polling-status",
                dest: response.dest,
                status: response.status,
            })

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
    listener: {
        createSession: Publisher<CreateSessionEvent>[]
        pollingStatus: Publisher<PollingStatusEvent>[]
        reset: Publisher<ResetEvent>[]
    }

    constructor() {
        this.listener = {
            createSession: [],
            pollingStatus: [],
            reset: [],
        }
    }

    onCreateSessionEvent(pub: Publisher<CreateSessionEvent>): void {
        this.listener.createSession.push(pub)
    }
    onPollingStatusEvent(pub: Publisher<PollingStatusEvent>): void {
        this.listener.pollingStatus.push(pub)
    }
    onResetEvent(pub: Publisher<ResetEvent>): void {
        this.listener.reset.push(pub)
    }

    publishCreateSessionEvent(event: CreateSessionEvent): void {
        this.listener.createSession.forEach(pub => pub(event))
    }
    publishPollingStatusEvent(event: PollingStatusEvent): void {
        this.listener.pollingStatus.forEach(pub => pub(event))
    }
    publishResetEvent(event: ResetEvent): void {
        this.listener.reset.forEach(pub => pub(event))
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

interface Publisher<T> {
    (status: T): void
}
