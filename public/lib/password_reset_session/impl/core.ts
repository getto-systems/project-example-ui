import { Infra, TimeConfig, PasswordResetSessionClient } from "../infra"

import {
    PasswordResetSessionAction,
    PasswordResetSessionEventPublisher,
    PasswordResetSessionEventSubscriber,
    SessionEventSender, SessionResult,
    PollingStatusEventSender,
} from "../action"

import { InputContent, Session, PollingStatus, DoneStatus, CreateSessionEvent, PollingStatusEvent, PollingStatusError } from "../data"

import { LoginID } from "../../credential/data"
import { Content } from "../../field/data"

export function initPasswordResetSessionAction(infra: Infra): PasswordResetSessionAction {
    return new Action(infra)
}

class Action implements PasswordResetSessionAction {
    infra: Infra

    pub: PasswordResetSessionEventPublisher
    sub: PasswordResetSessionEventSubscriber

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
        function mapInput(loginID: Content<LoginID>): InputContent {
            return {
                loginID: loginID.input,
            }
        }
    }

    async startPollingStatus(session: Session): Promise<void> {
        const event = new EventWrapper(this.pub)
        new PollingStatusWorker(this.infra.timeConfig, this.infra.passwordResetSessionClient).startPolling(event, session)
    }

    async createSession_DEPRECATED(event: SessionEventSender, fields: [Content<LoginID>]): Promise<SessionResult> {
        const content = mapContent(...fields)
        if (!content.valid) {
            event.failedToCreateSession(mapInput(...fields), { type: "validation-error" })
            return { success: false }
        }

        event.tryToCreateSession()

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const promise = this.infra.passwordResetSessionClient.createSession(...content.content)
        const response = await delayed(promise, this.infra.timeConfig.passwordResetCreateSessionDelayTime, event.delayedToCreateSession)
        if (!response.success) {
            event.failedToCreateSession(mapInput(...fields), response.err)
            return { success: false }
        }

        return { success: true, session: response.session }

        type ValidContent =
            Readonly<{ valid: false }> |
            Readonly<{ valid: true, content: [LoginID] }>

        function mapContent(loginID: Content<LoginID>): ValidContent {
            if (!loginID.valid) {
                return { valid: false }
            }
            return { valid: true, content: [loginID.content] }
        }
        function mapInput(loginID: Content<LoginID>): InputContent {
            return {
                loginID: loginID.input,
            }
        }
    }

    async startPollingStatus_DEPRECATED(event: PollingStatusEventSender, session: Session): Promise<void> {
        new PollingStatusWorker(this.infra.timeConfig, this.infra.passwordResetSessionClient).startPolling(event, session)
    }
}

// TODO 必要なくなったら削除
class EventWrapper {
    pub: PasswordResetSessionEventPublisher

    constructor(pub: PasswordResetSessionEventPublisher) {
        this.pub = pub
    }

    tryToPollingStatus(): void {
        this.pub.publishPollingStatusEvent({ type: "try-to-polling-status" })
    }
    retryToPollingStatus(status: PollingStatus): void {
        this.pub.publishPollingStatusEvent({ type: "retry-to-polling-status", status })
    }
    failedToPollingStatus(err: PollingStatusError): void {
        this.pub.publishPollingStatusEvent({ type: "failed-to-polling-status", err })
    }

    succeedToSendToken(status: DoneStatus): void {
        this.pub.publishPollingStatusEvent({ type: "succeed-to-send-token", status })
    }
}

type SendTokenState =
    Readonly<{ type: "initial" }> |
    Readonly<{ type: "failed", err: PollingStatusError }> |
    Readonly<{ type: "success" }>

// TODO worker ってなまえはよくない
class PollingStatusWorker {
    timeConfig: TimeConfig
    client: PasswordResetSessionClient

    sendTokenState: SendTokenState

    constructor(timeConfig: TimeConfig, client: PasswordResetSessionClient) {
        this.timeConfig = timeConfig
        this.client = client

        this.sendTokenState = { type: "initial" }
    }

    // TODO EventSender は削除予定
    async startPolling(event: PollingStatusEventSender, session: Session): Promise<void> {
        event.tryToPollingStatus()

        this.sendToken()

        let count = 0

        while (count < this.timeConfig.passwordResetPollingLimit.limit) {
            count += 1

            if (this.sendTokenState.type === "failed") {
                event.failedToPollingStatus(this.sendTokenState.err)
                return
            }

            const response = await this.client.getStatus(session)
            if (!response.success) {
                event.failedToPollingStatus(response.err)
                return
            }

            if (response.done) {
                event.succeedToSendToken(response.status)
                return
            }

            event.retryToPollingStatus(response.status)

            await wait(this.timeConfig.passwordResetPollingWaitTime)
        }

        event.failedToPollingStatus({ type: "infra-error", err: "overflow polling limit" })
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

class EventPubSub implements PasswordResetSessionEventPublisher, PasswordResetSessionEventSubscriber {
    holder: {
        createSession: PublisherHolder<CreateSessionEvent>
        pollingStatus: PublisherHolder<PollingStatusEvent>
    }

    constructor() {
        this.holder = {
            createSession: { set: false },
            pollingStatus: { set: false },
        }
    }

    onCreateSessionEvent(pub: Publisher<CreateSessionEvent>): void {
        this.holder.createSession = { set: true, pub }
    }
    onPollingStatusEvent(pub: Publisher<PollingStatusEvent>): void {
        this.holder.pollingStatus = { set: true, pub }
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
    (state: T): void
}
