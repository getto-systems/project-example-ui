import { PasswordLoginActionInfra, SubmitPasswordLogin } from "./infra"

import { PasswordLoginAction, PasswordLoginActionPod } from "./action"
import { SubmitPasswordLoginEvent } from "./event"

export function initPasswordLoginAction(pod: PasswordLoginActionPod): PasswordLoginAction {
    return {
        submit: pod.initSubmit(),
    }
}
export function initPasswordLoginActionPod(infra: PasswordLoginActionInfra): PasswordLoginActionPod {
    return {
        initSubmit: submit(infra),
    }
}

const submit: SubmitPasswordLogin = (infra) => () => async (fields, post) => {
    if (!fields.success) {
        post({ type: "failed-to-login", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-login" })

    const { login, config, delayed } = infra

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(login(fields.value), config.delay, () =>
        post({ type: "delayed-to-login" })
    )
    if (!response.success) {
        post({ type: "failed-to-login", err: response.err })
        return
    }

    post({ type: "succeed-to-login", authCredential: response.value.auth })
}

export function submitEventHasDone(event: SubmitPasswordLoginEvent): boolean {
    switch (event.type) {
        case "succeed-to-login":
        case "failed-to-login":
            return true

        case "try-to-login":
        case "delayed-to-login":
            return false
    }
}
