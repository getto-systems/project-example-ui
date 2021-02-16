import { newAuthenticatePasswordAction_merge } from "../core"

import { AuthenticatePasswordAction } from "../../action"

import { AuthenticatePasswordEvent } from "../../../../../../password/authenticate/event"

import {
    WorkerForegroundProxyAction,
    WorkerForegroundProxyBase,
    WorkerForegroundProxyMethod,
} from "../../../../../../../../common/vendor/getto-worker/main/foreground"

import {
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyParams,
    AuthenticatePasswordProxyResponse,
} from "./message"

export function newAuthenticatePasswordActionProxy(
    webStorage: Storage,
    post: Post<AuthenticatePasswordProxyMessage>
): AuthenticatePasswordActionProxy {
    return new Proxy(webStorage, post)
}
export type AuthenticatePasswordActionProxy = WorkerForegroundProxyAction<
    AuthenticatePasswordAction,
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse
>

class Proxy
    extends WorkerForegroundProxyBase<AuthenticatePasswordProxyMessage>
    implements AuthenticatePasswordActionProxy {
    webStorage: Storage
    authenticate: WorkerForegroundProxyMethod<
        AuthenticatePasswordProxyParams,
        AuthenticatePasswordEvent
    >

    constructor(webStorage: Storage, post: Post<AuthenticatePasswordProxyMessage>) {
        super(post)
        this.webStorage = webStorage
        this.authenticate = this.method((message) => ({
            method: "authenticate",
            ...message,
        }))
    }

    action(): AuthenticatePasswordAction {
        return newAuthenticatePasswordAction_merge(this.webStorage, {
            authenticate: (fields, post) => this.authenticate.call({ fields }, post),
        })
    }
    resolve(response: AuthenticatePasswordProxyResponse): void {
        switch (response.method) {
            case "authenticate":
                this.authenticate.resolve(response)
                break
        }
    }
}

interface Post<M> {
    (message: M): void
}
