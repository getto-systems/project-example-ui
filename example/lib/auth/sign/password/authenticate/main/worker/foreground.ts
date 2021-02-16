import {
    WorkerForegroundProxyAction,
    WorkerForegroundProxyBase,
    WorkerForegroundProxyMethod,
} from "../../../../../../common/vendor/getto-worker/main/foreground"

import {
    PasswordLoginActionProxyMessage,
    PasswordLoginActionProxyResponse,
    SubmitPasswordLoginProxyParams,
} from "./message"

import { AuthenticatePasswordActionPod_legacy } from "../../action"

import { AuthenticatePasswordEvent } from "../../event"

export function newPasswordLoginActionForegroundProxy(
    post: Post<PasswordLoginActionProxyMessage>
): PasswordLoginActionForegroundProxy {
    return new Proxy(post)
}
export type PasswordLoginActionForegroundProxy = WorkerForegroundProxyAction<
    AuthenticatePasswordActionPod_legacy,
    PasswordLoginActionProxyMessage,
    PasswordLoginActionProxyResponse
>

class Proxy
    extends WorkerForegroundProxyBase<PasswordLoginActionProxyMessage>
    implements PasswordLoginActionForegroundProxy {
    submit: WorkerForegroundProxyMethod<SubmitPasswordLoginProxyParams, AuthenticatePasswordEvent>

    constructor(post: Post<PasswordLoginActionProxyMessage>) {
        super(post)
        this.submit = this.method((message) => ({ method: "submit", ...message }))
    }

    pod(): AuthenticatePasswordActionPod_legacy {
        return {
            initAuthenticate: () => (fields, post) => this.submit.call({ fields }, post),
        }
    }
    resolve(response: PasswordLoginActionProxyResponse): void {
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
