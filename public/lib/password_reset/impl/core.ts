import { StartSessionInfra, PollingStatusInfra, ResetInfra } from "../infra"

import {
    StartSessionAction,
    StartSessionFieldCollector,
    PollingStatusAction,
    ResetAction,
    ResetFieldCollector,
} from "../action"

import {
    SessionID,
    StartSessionFields,
    PollingStatusEvent,
    PollingStatusError,
    ResetFields,
} from "../data"

import { Content, validContent, invalidContent } from "../../field/data"

const startSession = (
    fields: StartSessionFieldCollector,
    { client, time, delayed }: StartSessionInfra
): StartSessionAction => async (post) => {
    const content = await collectStartSessionFields(fields)
    if (!content.valid) {
        post({ type: "failed-to-start-session", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-start-session" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(
        client.startSession(content.content),
        time.passwordResetStartSessionDelayTime,
        () => post({ type: "delayed-to-start-session" })
    )
    if (!response.success) {
        post({ type: "failed-to-start-session", err: response.err })
        return
    }

    // TODO ここで polling を始めてしまったほうがいい気がする
    post({ type: "succeed-to-start-session", sessionID: response.sessionID })
}

async function collectStartSessionFields(
    collector: StartSessionFieldCollector
): Promise<Content<StartSessionFields>> {
    const loginID = await collector.loginID()

    if (!loginID.valid) {
        return invalidContent()
    }
    return validContent({
        loginID: loginID.content,
    })
}

const startPollingStatus = (infra: PollingStatusInfra) => (
    sessionID: SessionID,
    post: Post<PollingStatusEvent>
): void => {
    new StatusPoller(infra).startPolling(sessionID, post)
}

type SendTokenState =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "failed"; err: PollingStatusError }>
    | Readonly<{ type: "success" }>

class StatusPoller {
    infra: PollingStatusInfra

    sendTokenState: SendTokenState

    constructor(infra: PollingStatusInfra) {
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

            const response = await this.infra.client.getStatus(sessionID)
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
        const response = await this.infra.client.sendToken()
        if (!response.success) {
            this.sendTokenState = { type: "failed", err: response.err }
            return
        }
        this.sendTokenState = { type: "success" }
    }
}

const reset = (
    fields: ResetFieldCollector,
    { client, time, delayed }: ResetInfra
): ResetAction => async (resetToken, post) => {
    const content = await collectResetFields(fields)
    if (!content.valid) {
        post({ type: "failed-to-reset", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-reset" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(
        client.reset(resetToken, content.content),
        time.passwordResetDelayTime,
        () => post({ type: "delayed-to-reset" })
    )
    if (!response.success) {
        post({ type: "failed-to-reset", err: response.err })
        return
    }

    post({ type: "succeed-to-reset", authCredential: response.authCredential })
}

async function collectResetFields(collector: ResetFieldCollector): Promise<Content<ResetFields>> {
    const loginID = await collector.loginID()
    const password = await collector.password()

    if (!loginID.valid || !password.valid) {
        return invalidContent()
    }
    return validContent({
        loginID: loginID.content,
        password: password.content,
    })
}

export function initStartSessionAction(
    fields: StartSessionFieldCollector,
    infra: StartSessionInfra
): StartSessionAction {
    return startSession(fields, infra)
}
export function initPollingStatusAction(infra: PollingStatusInfra): PollingStatusAction {
    return startPollingStatus(infra)
}
export function initResetAction(fields: ResetFieldCollector, infra: ResetInfra): ResetAction {
    return reset(fields, infra)
}

interface Post<T> {
    (status: T): void
}
