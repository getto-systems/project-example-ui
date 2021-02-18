import { AuthenticatePasswordCoreBackground } from "../../Core/action"

import {
    WorkerProxy,
    WorkerAbstractProxy,
} from "../../../../../../../../z_vendor/getto-worker/foreground"

import {
    AuthenticatePasswordProxyMaterial,
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "../../main/worker/message"

export type AuthenticatePasswordProxy = WorkerProxy<
    AuthenticatePasswordCoreBackground,
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
    material: AuthenticatePasswordProxyMaterial

    constructor(webStorage: Storage, post: Post<AuthenticatePasswordProxyMessage>) {
        super(post)
        this.webStorage = webStorage
        this.material = { authenticate: this.method("authenticate", (message) => message) }
    }

    background(): AuthenticatePasswordCoreBackground {
        return {
            authenticate: (fields, post) => this.material.authenticate.call({ fields }, post),
        }
    }
    resolve(response: AuthenticatePasswordProxyResponse): void {
        switch (response.method) {
            case "authenticate":
                this.material.authenticate.resolve(response)
                break
        }
    }
}

interface Post<M> {
    (message: M): void
}
