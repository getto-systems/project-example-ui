import { delayedChecker } from "../../../../../z_vendor/getto-application/infra/timer/helper"

import { RequestResetTokenInfra } from "../infra"

import { RequestResetTokenMethod } from "../method"

import { RequestResetTokenEvent } from "../event"

import { resetSessionIDRemoteConverter } from "../../converter"

interface RequestToken {
    (infra: RequestResetTokenInfra): RequestResetTokenMethod
}
export const requestResetToken: RequestToken = (infra) => async (fields, post) => {
    if (!fields.valid) {
        post({ type: "failed-to-request-token", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-request-token" })

    const { config } = infra
    const requestToken = infra.requestToken(resetSessionIDRemoteConverter)

    // ネットワークの状態が悪い可能性があるので、一定時間後に take longtime イベントを発行
    const response = await delayedChecker(requestToken(fields.value), config.takeLongtimeThreshold, () =>
        post({ type: "take-longtime-to-request-token" }),
    )
    if (!response.success) {
        post({ type: "failed-to-request-token", err: response.err })
        return
    }

    post({ type: "succeed-to-request-token", sessionID: response.value })
}

export function requestResetTokenEventHasDone(event: RequestResetTokenEvent): boolean {
    switch (event.type) {
        case "succeed-to-request-token":
        case "failed-to-request-token":
            return true

        case "try-to-request-token":
        case "take-longtime-to-request-token":
            return false
    }
}
