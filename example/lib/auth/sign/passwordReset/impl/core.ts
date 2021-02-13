import { StartSessionInfra, CheckStatusInfra, ResetInfra } from "../infra"

import { StartSessionPod, CheckStatusPod, ResetPod } from "../action"

import { CheckStatusEvent } from "../event"

import { SessionID, CheckStatusError } from "../data"

export const startSession = (infra: StartSessionInfra): StartSessionPod => () => async (
    fields,
    post
) => {
    if (!fields.success) {
        post({ type: "failed-to-start-session", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-start-session" })

    const { startSession, config: time, delayed } = infra

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(startSession(fields.value), time.delay, () =>
        post({ type: "delayed-to-start-session" })
    )
    if (!response.success) {
        post({ type: "failed-to-start-session", err: response.err })
        return
    }

    post({ type: "succeed-to-start-session", sessionID: response.value })
}

export const checkStatus = (infra: CheckStatusInfra): CheckStatusPod => () => (sessionID, post) => {
    new StatusChecker(infra).start(sessionID, post)
}

type SendTokenState =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "failed"; err: CheckStatusError }>
    | Readonly<{ type: "success" }>

class StatusChecker {
    infra: CheckStatusInfra

    sendTokenState: SendTokenState

    constructor(infra: CheckStatusInfra) {
        this.infra = infra

        this.sendTokenState = { type: "initial" }
    }

    async start(sessionID: SessionID, post: Post<CheckStatusEvent>): Promise<void> {
        post({ type: "try-to-check-status" })

        this.sendToken()

        for (let i_ = 0; i_ < this.infra.config.limit.limit; i_++) {
            if (this.sendTokenState.type === "failed") {
                post({ type: "failed-to-check-status", err: this.sendTokenState.err })
                return
            }

            const response = await this.infra.getStatus(sessionID)
            if (!response.success) {
                post({ type: "failed-to-check-status", err: response.err })
                return
            }

            const result = response.value
            if (result.done) {
                if (!result.send) {
                    post({
                        type: "failed-to-send-token",
                        dest: result.dest,
                        err: { type: "infra-error", err: result.err },
                    })
                    return
                }

                post({ type: "succeed-to-send-token", dest: result.dest })
                return
            }

            post({
                type: "retry-to-check-status",
                dest: result.dest,
                status: result.status,
            })

            await this.infra.wait(this.infra.config.wait, () => true)
        }

        post({
            type: "failed-to-check-status",
            err: { type: "infra-error", err: "overflow check limit" },
        })
    }

    async sendToken(): Promise<void> {
        const response = await this.infra.sendToken(null)
        if (!response.success) {
            this.sendTokenState = { type: "failed", err: response.err }
            return
        }
        this.sendTokenState = { type: "success" }
    }
}

export const reset = (infra: ResetInfra): ResetPod => (locationInfo) => async (fields, post) => {
    if (!fields.success) {
        post({ type: "failed-to-reset", err: { type: "validation-error" } })
        return
    }

    const resetToken = locationInfo.getResetToken()
    if (!resetToken) {
        post({ type: "failed-to-reset", err: { type: "empty-reset-token" } })
        return
    }

    post({ type: "try-to-reset" })

    const { reset, config, delayed } = infra

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(reset({ resetToken, fields: fields.value }), config.delay, () =>
        post({ type: "delayed-to-reset" })
    )
    if (!response.success) {
        post({ type: "failed-to-reset", err: response.err })
        return
    }

    post({ type: "succeed-to-reset", authCredential: response.value.auth })
}

interface Post<T> {
    (status: T): void
}
