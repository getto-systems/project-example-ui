import { ticker } from "../../../../../z_vendor/getto-application/infra/timer/helper"
import { passThroughRemoteValue } from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { CheckResetTokenSendingStatusInfra } from "../infra"

import {
    CheckResetTokenSendingStatusLocationDetectMethod,
    CheckResetTokenSendingStatusPod,
} from "../method"

import { resetSessionIDLocationConverter } from "../../converter"

import { CheckResetTokenSendingStatusError } from "../data"
import { SignNav, signNavKey } from "../../../../common/nav/data"

export const detectSessionID: CheckResetTokenSendingStatusLocationDetectMethod = (currentURL) =>
    resetSessionIDLocationConverter(
        currentURL.searchParams.get(signNavKey(SignNav.passwordResetSessionID)),
    )

interface CheckStatus {
    (infra: CheckResetTokenSendingStatusInfra): CheckResetTokenSendingStatusPod
}
export const checkSendingStatus: CheckStatus = (infra) => (detecter) => async (post) => {
    const { config } = infra
    const sendToken = infra.sendToken(passThroughRemoteValue)
    const getStatus = infra.getStatus(passThroughRemoteValue)

    const sessionID = detecter()
    if (!sessionID.valid) {
        return post({ type: "failed-to-check-status", err: { type: "empty-session-id" } })
    }

    type SendTokenState =
        | Readonly<{ type: "initial" }>
        | Readonly<{ type: "failed"; err: CheckResetTokenSendingStatusError }>
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
            return post({ type: "failed-to-check-status", err: currentSendTokenState.err })
        }

        const response = await getStatus(sessionID.value)
        if (!response.success) {
            return post({ type: "failed-to-check-status", err: response.err })
        }

        const result = response.value
        if (result.done) {
            if (!result.send) {
                return post({
                    type: "failed-to-send-token",
                    err: { type: "infra-error", err: result.err },
                })
            }

            return post({ type: "succeed-to-send-token" })
        }

        post({ type: "retry-to-check-status", status: result.status })

        await ticker(config.wait, () => true)
    }

    return post({
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
