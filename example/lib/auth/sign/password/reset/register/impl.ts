import { RegisterActionInfra } from "./infra"

import { RegisterActionPod, RegisterAction, RegisterActionLocationInfo } from "./action"

import { markResetToken, ResetToken } from "./data"
import { AuthSearchParams } from "../../../location/data"
import { Submit } from "./infra"
import { SubmitEvent } from "./event"

export function detectResetToken(currentURL: URL): ResetToken {
    return markResetToken(currentURL.searchParams.get(AuthSearchParams.passwordResetToken) || "")
}

export function initRegisterAction(
    pod: RegisterActionPod,
    locationInfo: RegisterActionLocationInfo
): RegisterAction {
    return {
        submit: pod.initSubmit(locationInfo),
    }
}
export function initRegisterActionPod(infra: RegisterActionInfra): RegisterActionPod {
    return {
        initSubmit: submit(infra),
    }
}

const submit: Submit = (infra) => (locationInfo) => async (fields, post) => {
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

    const { register: reset, config, delayed } = infra

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(reset({ resetToken, fields: fields.value }), config.delay, () =>
        post({ type: "delayed-to-reset" })
    )
    if (!response.success) {
        post({ type: "failed-to-reset", err: response.err })
        return
    }

    post({ type: "succeed-to-reset", authCredential: response.value.auth })
}

export function submitEventHasDone(event: SubmitEvent): boolean {
    switch (event.type) {
        case "succeed-to-reset":
        case "failed-to-reset":
            return true

        case "try-to-reset":
        case "delayed-to-reset":
            return false
    }
}
