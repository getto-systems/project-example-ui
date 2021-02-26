import { ResetInfra } from "./infra"

import { ResetLocationInfo, ResetPod } from "./method"

import { ResetEvent } from "./event"

import { authSignSearchKey_password_reset_token } from "../../../common/searchParams/data"
import { markResetToken, ResetToken } from "../kernel/data"

export function initResetLocationInfo(currentURL: URL): ResetLocationInfo {
    return {
        getResetToken: () => detectResetToken(currentURL),
    }
}

export function detectResetToken(currentURL: URL): ResetToken {
    return markResetToken(
        currentURL.searchParams.get(authSignSearchKey_password_reset_token()) || "",
    )
}

interface Reset {
    (infra: ResetInfra): ResetPod
}
export const reset: Reset = (infra) => (locationInfo) => async (fields, post) => {
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

    const { reset: register, config, delayed } = infra

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(
        register({ resetToken, fields: fields.value }),
        config.delay,
        () => post({ type: "delayed-to-reset" }),
    )
    if (!response.success) {
        post({ type: "failed-to-reset", err: response.err })
        return
    }

    post({ type: "succeed-to-reset", authnInfo: response.value.auth })
}

export function resetEventHasDone(event: ResetEvent): boolean {
    switch (event.type) {
        case "succeed-to-reset":
        case "failed-to-reset":
            return true

        case "try-to-reset":
        case "delayed-to-reset":
            return false
    }
}