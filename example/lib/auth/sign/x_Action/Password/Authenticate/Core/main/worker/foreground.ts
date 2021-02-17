import { newAuthenticatePasswordAction_merge } from "../core"

import { AuthenticatePasswordAction } from "../../action"

import { AuthenticatePasswordEvent } from "../../../../../../password/authenticate/event"

import {
    WorkerProxy,
    WorkerAbstractProxy,
    WorkerProxyMethod,
} from "../../../../../../../../common/vendor/getto-worker/main/foreground"

import {
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyParams,
    AuthenticatePasswordProxyResponse,
} from "./message"

export type AuthenticatePasswordProxy = WorkerProxy<
    AuthenticatePasswordAction,
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse
>
export function newAuthenticatePasswordProxy(
    webStorage: Storage,
    post: Post<AuthenticatePasswordProxyMessage>
): AuthenticatePasswordProxy {
    return new Proxy(webStorage, post)
}

class Proxy
    extends WorkerAbstractProxy<AuthenticatePasswordProxyMessage>
    implements AuthenticatePasswordProxy {
    webStorage: Storage
    authenticate: WorkerProxyMethod<
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
