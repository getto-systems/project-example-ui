import { delayedChecker } from "../../../../../z_vendor/getto-application/infra/timer/helper"

import { RequestTokenInfra } from "./infra"

import { RequestTokenMethod } from "./method"

import { RequestTokenEvent } from "./event"

import { convertResetSessionIDFromRemote } from "../kernel/convert"

import { authSignHref_password_reset_checkStatus } from "../../../common/searchParams/data"
import { passThroughRemoteConverter } from "../../../../../z_vendor/getto-application/infra/remote/helper"

interface RequestToken {
    (infra: RequestTokenInfra): RequestTokenMethod
}
export const requestToken: RequestToken = (infra) => async (fields, post) => {
    if (!fields.valid) {
        post({ type: "failed-to-request-token", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-request-token" })

    const { config } = infra
    const requestToken = infra.requestToken(passThroughRemoteConverter)

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayedChecker(requestToken(fields.value), config.delay, () =>
        post({ type: "delayed-to-request-token" }),
    )
    if (!response.success) {
        post({ type: "failed-to-request-token", err: response.err })
        return
    }

    post({
        type: "succeed-to-request-token",
        href: authSignHref_password_reset_checkStatus(
            convertResetSessionIDFromRemote(response.value),
        ),
    })
}

export function requestTokenEventHasDone(event: RequestTokenEvent): boolean {
    switch (event.type) {
        case "succeed-to-request-token":
        case "failed-to-request-token":
            return true

        case "try-to-request-token":
        case "delayed-to-request-token":
            return false
    }
}
