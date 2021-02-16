import { newAuthenticatePasswordAction_merge } from "../core"

import { AuthenticatePasswordEvent } from "../../../../../../password/authenticate/event"

import { AuthenticatePasswordAction } from "../../action"

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
    post: Post<AuthenticatePasswordProxyMessage>
): AuthenticatePasswordActionProxy {
    return new Proxy(post)
}
export interface AuthenticatePasswordActionProxy
    extends WorkerForegroundProxyAction<
        AuthenticatePasswordProxyMessage,
        AuthenticatePasswordProxyResponse
    > {
    action(webStorage: Storage): AuthenticatePasswordAction
}

class Proxy
    extends WorkerForegroundProxyBase<AuthenticatePasswordProxyMessage>
    implements AuthenticatePasswordActionProxy {
    authenticate: WorkerForegroundProxyMethod<
        AuthenticatePasswordProxyParams,
        AuthenticatePasswordEvent
    >

    constructor(post: Post<AuthenticatePasswordProxyMessage>) {
        super(post)
        this.authenticate = this.method((message) => ({
            method: "authenticate",
            ...message,
        }))
    }

    action(webStorage: Storage): AuthenticatePasswordAction {
        return newAuthenticatePasswordAction_merge(webStorage, {
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
