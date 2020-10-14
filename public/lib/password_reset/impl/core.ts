import { SessionInfra, ResetInfra } from "../infra"

import { SessionFactory, ResetFactory, SessionSubscriber, ResetSubscriber } from "../action"

import {
    SessionID,
    StartSessionContent, StartSessionFields,
    StartSessionEvent, PollingStatusEvent, PollingStatusError,
    ResetContent, ResetFields,
    ResetToken, ResetEvent,
} from "../data"

import { Content, validContent, invalidContent } from "../../field/data"

const startSession = (infra: SessionInfra, post: Post<StartSessionEvent>) => async (content: StartSessionContent): Promise<void> => {
    const fields = mapStartSessionContent(content)
    if (!fields.valid) {
        post({ type: "failed-to-start-session", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-start-session" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await infra.delayed(
        infra.passwordResetSessionClient.startSession(fields.content.loginID),
        infra.time.passwordResetStartSessionDelayTime,
        () => post({ type: "delayed-to-start-session" }),
    )
    if (!response.success) {
        post({ type: "failed-to-start-session", err: response.err })
        return
    }

    post({ type: "succeed-to-start-session", sessionID: response.sessionID })
}

function mapStartSessionContent(content: StartSessionContent): Content<StartSessionFields> {
    if (!content.loginID.valid) {
        return invalidContent()
    }
    return validContent({
        loginID: content.loginID.content,
    })
}

const startPollingStatus = (infra: SessionInfra, post: Post<PollingStatusEvent>) => (sessionID: SessionID): void => {
    new StatusPoller(infra, post).startPolling(sessionID)
}

type SendTokenState =
    Readonly<{ type: "initial" }> |
    Readonly<{ type: "failed", err: PollingStatusError }> |
    Readonly<{ type: "success" }>

class StatusPoller {
    infra: SessionInfra
    post: Post<PollingStatusEvent>

    sendTokenState: SendTokenState

    constructor(infra: SessionInfra, post: Post<PollingStatusEvent>) {
        this.infra = infra
        this.post = post

        this.sendTokenState = { type: "initial" }
    }

    async startPolling(sessionID: SessionID): Promise<void> {
        this.post({ type: "try-to-polling-status" })

        this.sendToken()

        for (let i_ = 0; i_ < this.infra.time.passwordResetPollingLimit.limit; i_++) {
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

            await this.infra.wait(this.infra.time.passwordResetPollingWaitTime, () => true)
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

const reset = (infra: ResetInfra, post: Post<ResetEvent>) => async (resetToken: ResetToken, content: ResetContent): Promise<void> => {
    const fields = mapResetContent(content)
    if (!fields.valid) {
        post({ type: "failed-to-reset", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-reset" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await infra.delayed(
        infra.passwordResetClient.reset(resetToken, fields.content.loginID, fields.content.password),
        infra.time.passwordResetDelayTime,
        () => post({ type: "delayed-to-reset" }),
    )
    if (!response.success) {
        post({ type: "failed-to-reset", err: response.err })
        return
    }

    post({ type: "succeed-to-reset", authCredential: response.authCredential })
}

function mapResetContent(content: ResetContent): Content<ResetFields> {
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

export function initSessionFactory(infra: SessionInfra): SessionFactory {
    return () => {
        const pubsub = new SessionEventPubSub()
        return {
            action: {
                startSession: startSession(infra, event => pubsub.postStartSessionEvent(event)),
                startPollingStatus: startPollingStatus(infra, event => pubsub.postPollingStatusEvent(event)),
            },
            subscriber: pubsub,
        }
    }
}
export function initResetFactory(infra: ResetInfra): ResetFactory {
    return () => {
        const pubsub = new ResetEventPubSub()
        return {
            action: reset(infra, event => pubsub.postResetEvent(event)),
            subscriber: pubsub,
        }
    }
}

class SessionEventPubSub implements SessionSubscriber {
    startSession: Post<StartSessionEvent>[] = []
    pollingStatus: Post<PollingStatusEvent>[] = []

    onStartSessionEvent(post: Post<StartSessionEvent>): void {
        this.startSession.push(post)
    }
    postStartSessionEvent(event: StartSessionEvent): void {
        this.startSession.forEach(post => post(event))
    }

    onPollingStatusEvent(post: Post<PollingStatusEvent>): void {
        this.pollingStatus.push(post)
    }
    postPollingStatusEvent(event: PollingStatusEvent): void {
        this.pollingStatus.forEach(post => post(event))
    }
}

class ResetEventPubSub implements ResetSubscriber {
    reset: Post<ResetEvent>[] = []

    onResetEvent(post: Post<ResetEvent>): void {
        this.reset.push(post)
    }
    postResetEvent(event: ResetEvent): void {
        this.reset.forEach(post => post(event))
    }
}

interface Post<T> {
    (status: T): void
}
