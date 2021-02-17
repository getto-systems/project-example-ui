import { CheckPasswordResetSessionStatusInfra, StartPasswordResetSessionInfra } from "./infra"

import { StartPasswordResetSessionMethod, CheckPasswordResetSessionStatusMethod } from "./method"

import { CheckPasswordResetSessionStatusEvent, StartPasswordResetSessionEvent } from "./event"

import { CheckPasswordResetSessionStatusError } from "./data"

interface Start {
    (infra: StartPasswordResetSessionInfra): StartPasswordResetSessionMethod
}
export const startPasswordResetSession: Start = (infra) => async (fields, post) => {
    if (!fields.success) {
        post({ type: "failed-to-start-session", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-start-session" })

    const { start: startSession, config, delayed } = infra

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(startSession(fields.value), config.delay, () =>
        post({ type: "delayed-to-start-session" })
    )
    if (!response.success) {
        post({ type: "failed-to-start-session", err: response.err })
        return
    }

    post({ type: "succeed-to-start-session", sessionID: response.value })
}

export function startPasswordResetSessionEventHasDone(
    event: StartPasswordResetSessionEvent
): boolean {
    switch (event.type) {
        case "succeed-to-start-session":
        case "failed-to-start-session":
            return true

        case "try-to-start-session":
        case "delayed-to-start-session":
            return false
    }
}

interface CheckStatus {
    (infra: CheckPasswordResetSessionStatusInfra): CheckPasswordResetSessionStatusMethod
}
export const checkPasswordResetSessionStatus: CheckStatus = (infra) => async (sessionID, post) => {
    const { getStatus, sendToken, config, wait } = infra

    type SendTokenState =
        | Readonly<{ type: "initial" }>
        | Readonly<{ type: "failed"; err: CheckPasswordResetSessionStatusError }>
        | Readonly<{ type: "success" }>

    let sendTokenState: SendTokenState = { type: "initial" }
    function getSendTokenState(): SendTokenState {
        return sendTokenState
    }

    post({ type: "try-to-check-status" })

    requestSendToken()

    for (let i_ = 0; i_ < config.limit.limit; i_++) {
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

        await wait(config.wait, () => true)
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

export function checkPasswordResetSessionStatusEventHasDone(
    event: CheckPasswordResetSessionStatusEvent
): boolean {
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
