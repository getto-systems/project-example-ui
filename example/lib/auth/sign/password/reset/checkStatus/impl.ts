import { ticker } from "../../../../../z_vendor/getto-application/infra/timer/helper"
import { passThroughRemoteConverter } from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { CheckSendingStatusInfra } from "./infra"

import {
    CheckSendingStatusLocationDetectMethod,
    CheckSendingStatusLocationKeys,
    CheckSendingStatusMethodPod,
} from "./method"

import { CheckSendingStatusEvent } from "./event"

import { sessionIDLocationConverter } from "../kernel/convert"

import { CheckSendingStatusError } from "./data"

interface Detecter {
    (keys: CheckSendingStatusLocationKeys): CheckSendingStatusLocationDetectMethod
}
export const detectSessionID: Detecter = (keys) => (currentURL) =>
    sessionIDLocationConverter(currentURL.searchParams.get(keys.sessionID))

interface CheckStatus {
    (infra: CheckSendingStatusInfra): CheckSendingStatusMethodPod
}
export const checkSendingStatus: CheckStatus = (infra) => (detecter) => async (post) => {
    const { config } = infra
    const sendToken = infra.sendToken(passThroughRemoteConverter)
    const getStatus = infra.getStatus(passThroughRemoteConverter)

    const sessionID = detecter()
    if (!sessionID.valid) {
        post({ type: "failed-to-check-status", err: { type: "empty-session-id" } })
        return
    }

    type SendTokenState =
        | Readonly<{ type: "initial" }>
        | Readonly<{ type: "failed"; err: CheckSendingStatusError }>
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

        const response = await getStatus(sessionID.value)
        if (!response.success) {
            post({ type: "failed-to-check-status", err: response.err })
            return
        }

        const result = response.value
        if (result.done) {
            if (!result.send) {
                post({
                    type: "failed-to-send-token",
                    err: { type: "infra-error", err: result.err },
                })
                return
            }

            post({ type: "succeed-to-send-token" })
            return
        }

        post({ type: "retry-to-check-status", status: result.status })

        await ticker(config.wait, () => true)
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

export function checkSessionStatusEventHasDone(event: CheckSendingStatusEvent): boolean {
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
