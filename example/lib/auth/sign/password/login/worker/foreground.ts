import {
    WorkerForegroundProxyAction,
    WorkerForegroundProxyBase,
    WorkerForegroundProxyMethod,
} from "../../../../../vendor/getto-worker/worker/foreground"

import { LoginActionProxyMessage, LoginActionProxyResponse, SubmitProxyParams } from "./message"

import { LoginActionPod } from "../action"

import { SubmitEvent } from "../event"

export function newLoginActionForegroundProxy(
    post: Post<LoginActionProxyMessage>
): LoginActionForegroundProxy {
    return new Proxy(post)
}
export type LoginActionForegroundProxy = WorkerForegroundProxyAction<
    LoginActionPod,
    LoginActionProxyMessage,
    LoginActionProxyResponse
>

class Proxy
    extends WorkerForegroundProxyBase<LoginActionProxyMessage>
    implements LoginActionForegroundProxy {
    submit: WorkerForegroundProxyMethod<SubmitProxyParams, SubmitEvent>

    constructor(post: Post<LoginActionProxyMessage>) {
        super(post)
        this.submit = this.method((message) => ({ method: "submit", ...message }))
    }

    pod(): LoginActionPod {
        return {
            initSubmit: () => (fields, post) => this.submit.call({ fields }, post),
        }
    }
    resolve(response: LoginActionProxyResponse): void {
        switch (response.method) {
            case "submit":
                this.submit.resolve(response)
                break
        }
    }
}

interface Post<M> {
    (message: M): void
}
