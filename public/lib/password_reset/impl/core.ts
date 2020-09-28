import { Infra } from "../infra"

import { PasswordResetAction, PasswordResetEventPublisher, PasswordResetEventSubscriber } from "../action"

import {
    SessionID,
    StartSessionContent, StartSessionFields,
    StartSessionEvent, PollingStatusEvent, PollingStatusError,
    ResetContent, ResetFields,
    ResetToken, ResetEvent,
} from "../data"

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

    async startSession(content: StartSessionContent): Promise<void> {
        const post = (event: StartSessionEvent) => this.pub.postStartSessionEvent(event)

        const fields = mapStartSessionContent(content)
        if (!fields.valid) {
            post({ type: "failed-to-start-session", err: { type: "validation-error" } })
            return
        }

        post({ type: "try-to-start-session" })

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await this.infra.delayed(
            this.infra.passwordResetSessionClient.startSession(fields.content.loginID),
            this.infra.timeConfig.passwordResetStartSessionDelayTime,
            () => post({ type: "delayed-to-start-session" }),
        )
        if (!response.success) {
            post({ type: "failed-to-start-session", err: response.err })
            return
        }

        post({ type: "succeed-to-start-session", sessionID: response.sessionID })
    }

    async startPollingStatus(sessionID: SessionID): Promise<void> {
        const post = (event: PollingStatusEvent) => this.pub.postPollingStatusEvent(event)
        new StatusPoller(this.infra, post).startPolling(sessionID)
    }

    async reset(resetToken: ResetToken, content: ResetContent): Promise<void> {
        const post = (event: ResetEvent) => this.pub.postResetEvent(event)

        const fields = mapResetContent(content)
        if (!fields.valid) {
            post({ type: "failed-to-reset", err: { type: "validation-error" } })
            return
        }

        post({ type: "try-to-reset" })

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await this.infra.delayed(
            this.infra.passwordResetClient.reset(resetToken, fields.content.loginID, fields.content.password),
            this.infra.timeConfig.passwordResetDelayTime,
            () => post({ type: "delayed-to-reset" }),
        )
        if (!response.success) {
            post({ type: "failed-to-reset", err: response.err })
            return
        }

        post({ type: "succeed-to-reset", authCredential: response.authCredential })
    }
}

function mapStartSessionContent(content: StartSessionContent): Content<StartSessionFields> {
    if (!content.loginID.valid) {
        return { valid: false }
    }
    return {
        valid: true,
        content: {
            loginID: content.loginID.content,
        },
    }
}

function mapResetContent(content: ResetContent): Content<ResetFields> {
    if (
        !content.loginID.valid ||
        !content.password.valid
    ) {
        return { valid: false }
    }
    return {
        valid: true,
        content: {
            loginID: content.loginID.content,
            password: content.password.content,
        },
    }
}

type SendTokenState =
    Readonly<{ type: "initial" }> |
    Readonly<{ type: "failed", err: PollingStatusError }> |
    Readonly<{ type: "success" }>

class StatusPoller {
    infra: Infra
    post: Post<PollingStatusEvent>

    sendTokenState: SendTokenState

    constructor(infra: Infra, post: Post<PollingStatusEvent>) {
        this.infra = infra
        this.post = post

        this.sendTokenState = { type: "initial" }
    }

    async startPolling(sessionID: SessionID): Promise<void> {
        this.post({ type: "try-to-polling-status" })

        this.sendToken()

        for (let i_ = 0; i_ < this.infra.timeConfig.passwordResetPollingLimit.limit; i_++) {

            if (this.sendTokenState.type === "failed") {
                this.post({ type: "failed-to-polling-status", err: this.sendTokenState.err })
                return
            }

            const response = await this.infra.passwordResetSessionClient.getStatus(sessionID)
            if (!response.success) {
                this.post({ type: "failed-to-polling-status", err: response.err })
                return
            }

            if (response.done) {
                if (response.send) {
                    this.post({ type: "succeed-to-send-token", dest: response.dest })
                } else {
                    this.post({
                        type: "failed-to-send-token",
                        dest: response.dest,
                        err: { type: "infra-error", err: response.err },
                    })
                }
                return
            }

            this.post({
                type: "retry-to-polling-status",
                dest: response.dest,
                status: response.status,
            })

            await this.infra.wait(this.infra.timeConfig.passwordResetPollingWaitTime, () => true)
        }

        this.post({
            type: "failed-to-polling-status",
            err: { type: "infra-error", err: "overflow polling limit" },
        })
    }

    async sendToken(): Promise<void> {
        const response = await this.infra.passwordResetSessionClient.sendToken()
        if (!response.success) {
            this.sendTokenState = { type: "failed", err: response.err }
            return
        }
        this.sendTokenState = { type: "success" }
    }
}

class EventPubSub implements PasswordResetEventPublisher, PasswordResetEventSubscriber {
    listener: {
        startSession: Post<StartSessionEvent>[]
        pollingStatus: Post<PollingStatusEvent>[]
        reset: Post<ResetEvent>[]
    }

    constructor() {
        this.listener = {
            startSession: [],
            pollingStatus: [],
            reset: [],
        }
    }

    onStartSessionEvent(post: Post<StartSessionEvent>): void {
        this.listener.startSession.push(post)
    }
    onPollingStatusEvent(post: Post<PollingStatusEvent>): void {
        this.listener.pollingStatus.push(post)
    }
    onResetEvent(post: Post<ResetEvent>): void {
        this.listener.reset.push(post)
    }

    postStartSessionEvent(event: StartSessionEvent): void {
        this.listener.startSession.forEach(post => post(event))
    }
    postPollingStatusEvent(event: PollingStatusEvent): void {
        this.listener.pollingStatus.forEach(post => post(event))
    }
    postResetEvent(event: ResetEvent): void {
        this.listener.reset.forEach(post => post(event))
    }
}

interface Post<T> {
    (status: T): void
}
