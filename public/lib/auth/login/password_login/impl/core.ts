import { LoginInfra } from "../infra"

import { LoginPod } from "../action"

export const login = (infra: LoginInfra): LoginPod => (collector) => async (post) => {
    const content = await collector.getFields()
    if (!content.valid) {
        post({ type: "failed-to-login", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-login" })

    const { client, time, delayed } = infra

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(client.login(content.content), time.delay, () =>
        post({ type: "delayed-to-login" })
    )
    if (!response.success) {
        post({ type: "failed-to-login", err: response.err })
        return
    }

    post({ type: "succeed-to-login", authCredential: response.authCredential })
}
