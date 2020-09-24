import { Infra, TimeConfig, PasswordResetSessionClient } from "../infra"

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

    async startSession(fields: [Content<LoginID>]): Promise<void> {
        const dispatch = (event: StartSessionEvent) => this.pub.dispatchStartSessionEvent(event)

        const content = mapContent(...fields)
        if (!content.valid) {
            dispatch({ type: "failed-to-start-session", err: { type: "validation-error" } })
            return
        }

        dispatch({ type: "try-to-start-session" })

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await delayed(
            this.infra.passwordResetSessionClient.startSession(...content.content),
            this.infra.timeConfig.passwordResetStartSessionDelayTime,
            () => dispatch({ type: "delayed-to-start-session" }),
        )
        if (!response.success) {
            dispatch({ type: "failed-to-start-session", err: response.err })
            return
        }

        dispatch({ type: "succeed-to-start-session", sessionID: response.sessionID })

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
        const dispatch = (event: PollingStatusEvent) => this.pub.dispatchPollingStatusEvent(event)
        new StatusPoller(this.infra.timeConfig, this.infra.passwordResetSessionClient, dispatch).startPolling(sessionID)
    }

    async reset(resetToken: ResetToken, fields: [Content<LoginID>, Content<Password>]): Promise<void> {
        const dispatch = (event: ResetEvent) => this.pub.dispatchResetEvent(event)

        const content = mapContent(...fields)
        if (!content.valid) {
            dispatch({ type: "failed-to-reset", err: { type: "validation-error" } })
            return
        }

        dispatch({ type: "try-to-reset" })

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await delayed(
            this.infra.passwordResetClient.reset(resetToken, ...content.content),
            this.infra.timeConfig.passwordResetDelayTime,
            () => dispatch({ type: "delayed-to-reset" }),
        )
        if (!response.success) {
            dispatch({ type: "failed-to-reset", err: response.err })
            return
        }

        dispatch({ type: "succeed-to-reset", authCredential: response.authCredential })
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
    dispatch: Dispatcher<PollingStatusEvent>

    sendTokenState: SendTokenState

    constructor(timeConfig: TimeConfig, client: PasswordResetSessionClient, dispatch: Dispatcher<PollingStatusEvent>) {
        this.timeConfig = timeConfig
        this.client = client
        this.dispatch = dispatch

        this.sendTokenState = { type: "initial" }
    }

    async startPolling(sessionID: SessionID): Promise<void> {
        this.dispatch({ type: "try-to-polling-status" })

        this.sendToken()

        let count = 0

        while (count < this.timeConfig.passwordResetPollingLimit.limit) {
            count += 1

            if (this.sendTokenState.type === "failed") {
                this.dispatch({ type: "failed-to-polling-status", err: this.sendTokenState.err })
                return
            }

            const response = await this.client.getStatus(sessionID)
            if (!response.success) {
                this.dispatch({ type: "failed-to-polling-status", err: response.err })
                return
            }

            if (response.done) {
                if (response.send) {
                    this.dispatch({ type: "succeed-to-send-token", dest: response.dest })
                } else {
                    this.dispatch({
                        type: "failed-to-send-token",
                        dest: response.dest,
                        err: { type: "infra-error", err: response.err },
                    })
                }
                return
            }

            this.dispatch({
                type: "retry-to-polling-status",
                dest: response.dest,
                status: response.status,
            })

            await wait(this.timeConfig.passwordResetPollingWaitTime)
        }

        this.dispatch({
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
        startSession: Dispatcher<StartSessionEvent>[]
        pollingStatus: Dispatcher<PollingStatusEvent>[]
        reset: Dispatcher<ResetEvent>[]
    }

    constructor() {
        this.listener = {
            startSession: [],
            pollingStatus: [],
            reset: [],
        }
    }

    onStartSessionEvent(dispatch: Dispatcher<StartSessionEvent>): void {
        this.listener.startSession.push(dispatch)
    }
    onPollingStatusEvent(dispatch: Dispatcher<PollingStatusEvent>): void {
        this.listener.pollingStatus.push(dispatch)
    }
    onResetEvent(dispatch: Dispatcher<ResetEvent>): void {
        this.listener.reset.push(dispatch)
    }

    dispatchStartSessionEvent(event: StartSessionEvent): void {
        this.listener.startSession.forEach(dispatch => dispatch(event))
    }
    dispatchPollingStatusEvent(event: PollingStatusEvent): void {
        this.listener.pollingStatus.forEach(dispatch => dispatch(event))
    }
    dispatchResetEvent(event: ResetEvent): void {
        this.listener.reset.forEach(dispatch => dispatch(event))
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

interface Dispatcher<T> {
    (status: T): void
}
