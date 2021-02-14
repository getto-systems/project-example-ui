import { SessionActionInfra, StartSession, CheckStatus } from "./infra"

import { SessionActionPod, SessionAction } from "./action"

import { CheckStatusEvent, StartSessionEvent } from "./event"

import { CheckStatusError } from "./data"

export function initSessionAction(pod: SessionActionPod): SessionAction {
    return {
        startSession: pod.initStartSession(),
        checkStatus: pod.initCheckStatus(),
    }
}
export function initSessionActionPod(infra: SessionActionInfra): SessionActionPod {
    return {
        initStartSession: startSession(infra),
        initCheckStatus: checkStatus(infra),
    }
}

const startSession: StartSession = (infra) => () => async (fields, post) => {
    if (!fields.success) {
        post({ type: "failed-to-start-session", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-start-session" })

    const { startSession, config, delayed } = infra

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(startSession(fields.value), config.startSession.delay, () =>
        post({ type: "delayed-to-start-session" })
    )
    if (!response.success) {
        post({ type: "failed-to-start-session", err: response.err })
        return
    }

    post({ type: "succeed-to-start-session", sessionID: response.value })
}

export function startSessionEventHasDone(event: StartSessionEvent): boolean {
    switch (event.type) {
        case "succeed-to-start-session":
        case "failed-to-start-session":
            return true

        case "try-to-start-session":
        case "delayed-to-start-session":
            return false
    }
}

type SendTokenState =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "failed"; err: CheckStatusError }>
    | Readonly<{ type: "success" }>

const checkStatus: CheckStatus = (infra) => () => async (sessionID, post) => {
    const { getStatus, sendToken, config, wait } = infra

    let sendTokenState: SendTokenState = { type: "initial" }
    function getSendTokenState(): SendTokenState {
        return sendTokenState
    }

    post({ type: "try-to-check-status" })

    requestSendToken()

    for (let i_ = 0; i_ < config.checkStatus.limit.limit; i_++) {
        const currentSendTokenState = getSendTokenState()
        if (currentSendTokenState.type === "failed") {
            post({ type: "failed-to-check-status", err: currentSendTokenState.err })
            return
        }

        const response = await getStatus(sessionID)
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

        await wait(config.checkStatus.wait, () => true)
    }

    post({
        type: "failed-to-check-status",
        err: { type: "infra-error", err: "overflow check limit" },
    })

    async function requestSendToken() {
        const response = await sendToken(null)
        if (!response.success) {
            sendTokenState = { type: "failed", err: response.err }
            return
        }
        sendTokenState = { type: "success" }
    }
}

export function checkStatusEventHasDone(event: CheckStatusEvent): boolean {
    switch (event.type) {
        case "succeed-to-send-token":
        case "failed-to-check-status":
        case "failed-to-send-token":
            return true

        case "try-to-check-status":
        case "retry-to-check-status":
            return false
    }
}
