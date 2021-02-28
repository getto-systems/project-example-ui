import { delayedChecker } from "../../../../z_vendor/getto-application/infra/timer/helper"

import { AuthenticateInfra } from "./infra"

import { AuthenticateMethod } from "./method"
import { AuthenticateEvent } from "./event"

interface Authenticate {
    (infra: AuthenticateInfra): AuthenticateMethod
}
export const authenticate: Authenticate = (infra) => async (fields, post) => {
    if (!fields.valid) {
        post({ type: "failed-to-login", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-login" })

    const { authenticate, config } = infra

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayedChecker(authenticate(fields.value), config.delay, () =>
        post({ type: "delayed-to-login" }),
    )
    if (!response.success) {
        post({ type: "failed-to-login", err: response.err })
        return
    }

    post({ type: "succeed-to-login", authnInfo: response.value.auth })
}

export function authenticateEventHasDone(event: AuthenticateEvent): boolean {
    switch (event.type) {
        case "succeed-to-login":
        case "failed-to-login":
            return true

        case "try-to-login":
        case "delayed-to-login":
            return false
    }
}
