import { PasswordResetRegisterActionInfra } from "./infra"

import {
    PasswordResetRegisterActionPod,
    PasswordResetRegisterAction,
    PasswordResetRegisterActionLocationInfo,
} from "./action"

import { markPasswordResetToken, PasswordResetToken } from "./data"
import { AuthLocationSearchParams } from "../../../authLocation/data"
import { SubmitPasswordResetRegister } from "./infra"
import { SubmitPasswordResetRegisterEvent } from "./event"

export function initPasswordResetRegisterActionLocationInfo(
    currentURL: URL
): PasswordResetRegisterActionLocationInfo {
    return {
        getPasswordResetToken: () => detectResetToken(currentURL),
    }
}

function detectResetToken(currentURL: URL): PasswordResetToken {
    return markPasswordResetToken(
        currentURL.searchParams.get(AuthLocationSearchParams.passwordResetToken) || ""
    )
}

export function initPasswordResetRegisterAction(
    pod: PasswordResetRegisterActionPod,
    locationInfo: PasswordResetRegisterActionLocationInfo
): PasswordResetRegisterAction {
    return {
        submit: pod.initSubmit(locationInfo),
    }
}
export function initPasswordResetRegisterActionPod(
    infra: PasswordResetRegisterActionInfra
): PasswordResetRegisterActionPod {
    return {
        initSubmit: submit(infra),
    }
}

const submit: SubmitPasswordResetRegister = (infra) => (locationInfo) => async (fields, post) => {
    if (!fields.success) {
        post({ type: "failed-to-reset", err: { type: "validation-error" } })
        return
    }

    const resetToken = locationInfo.getPasswordResetToken()
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

export function submitPasswordResetRegisterEventHasDone(
    event: SubmitPasswordResetRegisterEvent
): boolean {
    switch (event.type) {
        case "succeed-to-reset":
        case "failed-to-reset":
            return true

        case "try-to-reset":
        case "delayed-to-reset":
            return false
    }
}
