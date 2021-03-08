import { delayedChecker } from "../../../../../../z_vendor/getto-application/infra/timer/helper"

import { ResetPasswordInfra } from "../infra"

import { ResetPasswordLocationDetectMethod, ResetPasswordLocationKeys, ResetPasswordPod } from "../method"

import { ResetPasswordEvent } from "../event"

import { authRemoteConverter } from "../../../../kernel/auth_info/kernel/convert"
import { resetTokenLocationConverter } from "../../kernel/convert"

interface Detecter {
    (keys: ResetPasswordLocationKeys): ResetPasswordLocationDetectMethod
}
export const detectResetToken: Detecter = (keys) => (currentURL) =>
    resetTokenLocationConverter(currentURL.searchParams.get(keys.token))

interface Reset {
    (infra: ResetPasswordInfra): ResetPasswordPod
}
export const resetPassword: Reset = (infra) => (detecter) => async (fields, post) => {
    if (!fields.valid) {
        post({ type: "failed-to-reset", err: { type: "validation-error" } })
        return
    }

    const resetToken = detecter()
    if (!resetToken.valid) {
        post({ type: "failed-to-reset", err: { type: "empty-reset-token" } })
        return
    }

    post({ type: "try-to-reset" })

    const { clock, config } = infra
    const reset = infra.reset(authRemoteConverter(clock))

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayedChecker(
        reset({ resetToken: resetToken.value, fields: fields.value }),
        config.delay,
        () => post({ type: "delayed-to-reset" }),
    )
    if (!response.success) {
        post({ type: "failed-to-reset", err: response.err })
        return
    }

    post({ type: "succeed-to-reset", auth: response.value })
}

export function resetPasswordEventHasDone(event: ResetPasswordEvent): boolean {
    switch (event.type) {
        case "succeed-to-reset":
        case "failed-to-reset":
            return true

        case "try-to-reset":
        case "delayed-to-reset":
            return false
    }
}
