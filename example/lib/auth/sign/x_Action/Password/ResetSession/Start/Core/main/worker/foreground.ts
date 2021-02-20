import { newStartPasswordResetSessionAction_merge } from "../core"

import {
    WorkerProxy,
    WorkerAbstractProxy,
} from "../../../../../../../../../z_getto/application/worker/foreground"

import {
    CheckPasswordResetSessionStatusProxyMethod,
    StartPasswordResetSessionProxyMessage,
    StartPasswordResetSessionProxyMethod,
    StartPasswordResetSessionProxyResponse,
} from "./message"

import { StartPasswordResetSessionAction } from "../../action"

export type StartPasswordResetSessionProxy = WorkerProxy<
    StartPasswordResetSessionAction,
    StartPasswordResetSessionProxyMessage,
    StartPasswordResetSessionProxyResponse
>
export function newStartPasswordResetSessionProxy(
    post: Post<StartPasswordResetSessionProxyMessage>
): StartPasswordResetSessionProxy {
    return new Proxy(post)
}

class Proxy
    extends WorkerAbstractProxy<StartPasswordResetSessionProxyMessage>
    implements StartPasswordResetSessionProxy {
    start: StartPasswordResetSessionProxyMethod
    checkStatus: CheckPasswordResetSessionStatusProxyMethod

    constructor(post: Post<StartPasswordResetSessionProxyMessage>) {
        super(post)
        this.start = this.method("start", (message) => message)
        this.checkStatus = this.method("checkStatus", (message) => message)
    }

    background(): StartPasswordResetSessionAction {
        return newStartPasswordResetSessionAction_merge({
            start: (fields, post) => this.start.call({ fields }, post),
            checkStatus: (sessionID, post) => this.checkStatus.call({ sessionID }, post),
        })
    }
    resolve(response: StartPasswordResetSessionProxyResponse): void {
        switch (response.method) {
            case "start":
                this.start.resolve(response)
                break

            case "checkStatus":
                this.checkStatus.resolve(response)
                break
        }
    }
}

interface Post<M> {
    (message: M): void
}
