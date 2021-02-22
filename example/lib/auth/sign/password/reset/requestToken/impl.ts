import { RequestPasswordResetTokenInfra } from "./infra"

import { RequestPasswordResetTokenMethod } from "./method"

import { RequestPasswordResetTokenEvent } from "./event"
import { authSignHref_password_reset_checkStatus } from "../../../common/searchParams/data"

interface RequestToken {
    (infra: RequestPasswordResetTokenInfra): RequestPasswordResetTokenMethod
}
export const requestPasswordResetToken: RequestToken = (infra) => async (fields, post) => {
    if (!fields.success) {
        post({ type: "failed-to-request-token", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-request-token" })

    const { request: startSession, config, delayed } = infra

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(startSession(fields.value), config.delay, () =>
        post({ type: "delayed-to-request-token" }),
    )
    if (!response.success) {
        post({ type: "failed-to-request-token", err: response.err })
        return
    }

    post({
        type: "succeed-to-request-token",
        href: authSignHref_password_reset_checkStatus(response.value),
    })
}

export function requestPasswordResetTokenEventHasDone(
    event: RequestPasswordResetTokenEvent,
): boolean {
    switch (event.type) {
        case "succeed-to-request-token":
        case "failed-to-request-token":
            return true

        case "try-to-request-token":
        case "delayed-to-request-token":
            return false
    }
}
