import { newStartPasswordResetSessionAction_merge } from "../core"

import {
    WorkerProxy,
    WorkerAbstractProxy,
    WorkerProxyMethod,
} from "../../../../../../../../../common/vendor/getto-worker/main/foreground"

import {
    CheckPasswordResetSessionStatusProxyParams,
    StartPasswordResetSessionProxyMessage,
    StartPasswordResetSessionProxyParams,
    StartPasswordResetSessionProxyResponse,
} from "./message"

import { StartPasswordResetSessionAction } from "../../action"

import {
    CheckPasswordResetSessionStatusEvent,
    StartPasswordResetSessionEvent,
} from "../../../../../../../password/resetSession/start/event"

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
    start: WorkerProxyMethod<StartPasswordResetSessionProxyParams, StartPasswordResetSessionEvent>
    checkStatus: WorkerProxyMethod<
        CheckPasswordResetSessionStatusProxyParams,
        CheckPasswordResetSessionStatusEvent
    >

    constructor(post: Post<StartPasswordResetSessionProxyMessage>) {
        super(post)
        this.start = this.method((message) => ({ method: "start", ...message }))
        this.checkStatus = this.method((message) => ({ method: "checkStatus", ...message }))
    }

    action(): StartPasswordResetSessionAction {
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
