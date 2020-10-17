import { SessionInfra, ResetInfra } from "../infra"

import { SessionAction, ResetAction } from "../action"

import {
    SessionID,
    StartSessionContent, StartSessionFields,
    StartSessionEvent, PollingStatusEvent, PollingStatusError,
    ResetContent, ResetFields,
    ResetToken, ResetEvent,
} from "../data"

import { Content, validContent, invalidContent } from "../../field/data"

const startSession = (infra: SessionInfra) => async (content: StartSessionContent, post: Post<StartSessionEvent>) => {
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

    // TODO ここで polling を始めてしまったほうがいい気がする
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

const startPollingStatus = (infra: SessionInfra) => (sessionID: SessionID, post: Post<PollingStatusEvent>): void => {
    new StatusPoller(infra).startPolling(sessionID, post)
}

type SendTokenState =
    Readonly<{ type: "initial" }> |
    Readonly<{ type: "failed", err: PollingStatusError }> |
    Readonly<{ type: "success" }>

class StatusPoller {
    infra: SessionInfra

    sendTokenState: SendTokenState

    constructor(infra: SessionInfra) {
        this.infra = infra

        this.sendTokenState = { type: "initial" }
    }

    async startPolling(sessionID: SessionID, post: Post<PollingStatusEvent>): Promise<void> {
        post({ type: "try-to-polling-status" })

        this.sendToken()

        for (let i_ = 0; i_ < this.infra.time.passwordResetPollingLimit.limit; i_++) {
            if (this.sendTokenState.type === "failed") {
                post({ type: "failed-to-polling-status", err: this.sendTokenState.err })
                return
            }

            const response = await this.infra.passwordResetSessionClient.getStatus(sessionID)
            if (!response.success) {
                post({ type: "failed-to-polling-status", err: response.err })
                return
            }

            if (response.done) {
                if (response.send) {
                    post({ type: "succeed-to-send-token", dest: response.dest })
                } else {
                    post({
                        type: "failed-to-send-token",
                        dest: response.dest,
                        err: { type: "infra-error", err: response.err },
                    })
                }
                return
            }

            post({
                type: "retry-to-polling-status",
                dest: response.dest,
                status: response.status,
            })

            await this.infra.wait(this.infra.time.passwordResetPollingWaitTime, () => true)
        }

        post({
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

const reset = (infra: ResetInfra) => async (resetToken: ResetToken, content: ResetContent, post: Post<ResetEvent>) => {
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

export function initSessionFactory(infra: SessionInfra): Factory<SessionAction> {
    return () => {
        return {
            startSession: startSession(infra),
            startPollingStatus: startPollingStatus(infra),
        }
    }
}
export function initResetFactory(infra: ResetInfra): Factory<ResetAction> {
    return () => reset(infra)
}

interface Post<T> {
    (status: T): void
}
interface Factory<T> {
    (): T
}
