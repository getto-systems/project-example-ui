import { newAuthenticatePasswordAction_merge } from "../core"

import { AuthenticatePasswordAction } from "../../action"

import {
    WorkerProxy,
    WorkerAbstractProxy,
} from "../../../../../../../../../z_vendor/getto-worker/foreground"

import {
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyMethod,
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
    authenticate: AuthenticatePasswordProxyMethod

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
