import { Infra } from "../infra"

import { PasswordLoginAction, PasswordLoginEventPublisher, PasswordLoginEventSubscriber } from "../action"
import { LoginContent, LoginFields } from "../data"

import { LoginEvent } from "../data"
import { Content, validContent, invalidContent } from "../../field/data"

export function initPasswordLoginAction(infra: Infra): PasswordLoginAction {
    return new Action(infra)
}

class Action implements PasswordLoginAction {
    infra: Infra

    pub: PasswordLoginEventPublisher
    sub: PasswordLoginEventSubscriber

    constructor(infra: Infra) {
        this.infra = infra

        const pubsub = new EventPubSub()
        this.pub = pubsub
        this.sub = pubsub
    }

    async login(content: LoginContent): Promise<void> {
        const post = (event: LoginEvent) => this.pub.postLoginEvent(event)

        const fields = mapContent(content)
        if (!fields.valid) {
            post({ type: "failed-to-login", err: { type: "validation-error" } })
            return
        }

        post({ type: "try-to-login" })

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await this.infra.delayed(
            this.infra.passwordLoginClient.login(fields.content.loginID, fields.content.password),
            this.infra.timeConfig.passwordLoginDelayTime,
            () => post({ type: "delayed-to-login" }),
        )
        if (!response.success) {
            post({ type: "failed-to-login", err: response.err })
            return
        }

        post({ type: "succeed-to-login", authCredential: response.authCredential })
    }
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

class EventPubSub implements PasswordLoginEventPublisher, PasswordLoginEventSubscriber {
    listener: {
        login: Post<LoginEvent>[]
    }

    constructor() {
        this.listener = {
            login: [],
        }
    }

    onLoginEvent(post: Post<LoginEvent>): void {
        this.listener.login.push(post)
    }

    postLoginEvent(event: LoginEvent): void {
        this.listener.login.forEach(post => post(event))
    }
}

interface Post<T> {
    (state: T): void
}
