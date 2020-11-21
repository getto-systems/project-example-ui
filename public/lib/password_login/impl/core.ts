import { LoginInfra } from "../infra"

import { Login } from "../action"

import { Content } from "../../field/data"

export const login = (infra: LoginInfra): Login => (collectFields) => async (post) => {
    const content = await collectFields()
    if (!content.valid) {
        post({ type: "failed-to-login", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-login" })

    const { client, time, delayed } = infra

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(client.login(content.content), time.passwordLoginDelayTime, () =>
        post({ type: "delayed-to-login" })
    )
    if (!response.success) {
        post({ type: "failed-to-login", err: response.err })
        return
    }

    post({ type: "succeed-to-login", authCredential: response.authCredential })
}

interface Collector<T> {
    (): Promise<Content<T>>
}
