import { LoginInfra } from "../infra"

import { LoginPod } from "../action"

export const login = (infra: LoginInfra): LoginPod => () => async (fields, post) => {
    if (!fields.success) {
        post({ type: "failed-to-login", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-login" })

    const { login: client, config: time, delayed } = infra

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(client.login(fields.value), time.delay, () =>
        post({ type: "delayed-to-login" })
    )
    if (!response.success) {
        post({ type: "failed-to-login", err: response.err })
        return
    }

    post({ type: "succeed-to-login", authCredential: response.authCredential })
}
