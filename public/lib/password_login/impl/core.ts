import { LoginInfra } from "../infra"

import { LoginAction, LoginFieldCollector } from "../action"

import { LoginFields } from "../data"
import { Content, validContent, invalidContent } from "../../field/data"

const login = (fields: LoginFieldCollector, { client, time, delayed }: LoginInfra): LoginAction => async (post) => {
    const content = await collect(fields)
    if (!content.valid) {
        post({ type: "failed-to-login", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-login" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(
        client.login(content.content),
        time.passwordLoginDelayTime,
        () => post({ type: "delayed-to-login" }),
    )
    if (!response.success) {
        post({ type: "failed-to-login", err: response.err })
        return
    }

    post({ type: "succeed-to-login", authCredential: response.authCredential })
}
async function collect(fields: LoginFieldCollector): Promise<Content<LoginFields>> {
    const loginID = await fields.loginID()
    const password = await fields.password()

    if (
        !loginID.valid ||
        !password.valid
    ) {
        return invalidContent()
    }
    return validContent({
        loginID: loginID.content,
        password: password.content,
    })
}

export function initLoginAction(fields: LoginFieldCollector, infra: LoginInfra): LoginAction {
    return login(fields, infra)
}

interface Post<T> {
    (event: T): void
}
