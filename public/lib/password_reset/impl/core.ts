import { Infra } from "../infra"

import { PasswordResetAction, PasswordResetEventPublisher, PasswordResetEventSubscriber } from "../action"

import {
    SessionID,
    StartSessionEvent, PollingStatusEvent, PollingStatusError,
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

    // TODO このタプルで受け取るのやめたほうがいいんじゃなかったっけ？
    async startSession(fields: [Content<LoginID>]): Promise<void> {
        const post = (event: StartSessionEvent) => this.pub.postStartSessionEvent(event)

        const content = mapContent(...fields)
        if (!content.valid) {
            post({ type: "failed-to-start-session", err: { type: "validation-error" } })
            return
        }

        post({ type: "try-to-start-session" })

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await this.infra.delayed(
            this.infra.passwordResetSessionClient.startSession(...content.content),
            this.infra.timeConfig.passwordResetStartSessionDelayTime,
            () => post({ type: "delayed-to-start-session" }),
        )
        if (!response.success) {
            post({ type: "failed-to-start-session", err: response.err })
            return
        }

        post({ type: "succeed-to-start-session", sessionID: response.sessionID })

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
        const post = (event: PollingStatusEvent) => this.pub.postPollingStatusEvent(event)
        new StatusPoller(this.infra, post).startPolling(sessionID)
    }

    async reset(resetToken: ResetToken, fields: [Content<LoginID>, Content<Password>]): Promise<void> {
        const post = (event: ResetEvent) => this.pub.postResetEvent(event)

        const content = mapContent(...fields)
        if (!content.valid) {
            post({ type: "failed-to-reset", err: { type: "validation-error" } })
            return
        }

        post({ type: "try-to-reset" })

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await this.infra.delayed(
            this.infra.passwordResetClient.reset(resetToken, ...content.content),
            this.infra.timeConfig.passwordResetDelayTime,
            () => post({ type: "delayed-to-reset" }),
        )
        if (!response.success) {
            post({ type: "failed-to-reset", err: response.err })
            return
        }

        post({ type: "succeed-to-reset", authCredential: response.authCredential })
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

            await this.infra.wait(this.infra.timeConfig.passwordResetPollingWaitTime, () => null)
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
