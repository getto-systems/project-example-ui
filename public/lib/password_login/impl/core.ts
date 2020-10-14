import { LoginInfra } from "../infra"

import { LoginFactory, LoginAction } from "../action"

import { LoginContent, LoginFields, LoginEvent } from "../data"
import { Content, validContent, invalidContent } from "../../field/data"

const loginAction = (infra: LoginInfra, post: Post<LoginEvent>): LoginAction => async (content) => {
    const fields = mapContent(content)
    if (!fields.valid) {
        post({ type: "failed-to-login", err: { type: "validation-error" } })
        return
    }

    post({ type: "try-to-login" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await infra.delayed(
        infra.passwordLoginClient.login(fields.content.loginID, fields.content.password),
        infra.time.passwordLoginDelayTime,
        () => post({ type: "delayed-to-login" }),
    )
    if (!response.success) {
        post({ type: "failed-to-login", err: response.err })
        return
    }

    post({ type: "succeed-to-login", authCredential: response.authCredential })
}

function mapContent(content: LoginContent): Content<LoginFields> {
    if (
        !content.loginID.valid ||
        !content.password.valid
    ) {
        return invalidContent()
    }
    return validContent({
        loginID: content.loginID.content,
        password: content.password.content,
    })
}

export function initLoginFactory(infra: LoginInfra): LoginFactory {
    return () => {
        const pubsub = new LoginEventPubSub()
        return {
            action: loginAction(infra, event => pubsub.postLoginEvent(event)),
            subscriber: pubsub,
        }
    }
}

class LoginEventPubSub {
    login: Post<LoginEvent>[] = []

    postLoginEvent(event: LoginEvent): void {
        this.login.forEach(post => post(event))
    }
    onLoginEvent(post: Post<LoginEvent>): void {
        this.login.push(post)
    }
}

interface Post<T> {
    (event: T): void
}
