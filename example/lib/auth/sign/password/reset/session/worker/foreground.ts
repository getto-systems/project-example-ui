import {
    WorkerForegroundProxyAction,
    WorkerForegroundProxyBase,
    WorkerForegroundProxyMethod,
} from "../../../../../../vendor/getto-worker/worker/foreground"

import {
    CheckStatusProxyParams,
    SessionActionProxyMessage,
    SessionActionProxyResponse,
    StartSessionProxyParams,
} from "./message"

import { SessionActionPod } from "../action"

import { CheckStatusEvent, StartSessionEvent } from "../event"

export function newSessionActionForegroundProxy(
    post: Post<SessionActionProxyMessage>
): SessionActionForegroundProxy {
    return new Proxy(post)
}
export type SessionActionForegroundProxy = WorkerForegroundProxyAction<
    SessionActionPod,
    SessionActionProxyMessage,
    SessionActionProxyResponse
>

class Proxy
    extends WorkerForegroundProxyBase<SessionActionProxyMessage>
    implements SessionActionForegroundProxy {
    startSession: WorkerForegroundProxyMethod<StartSessionProxyParams, StartSessionEvent>
    checkStatus: WorkerForegroundProxyMethod<CheckStatusProxyParams, CheckStatusEvent>

    constructor(post: Post<SessionActionProxyMessage>) {
        super(post)
        this.startSession = this.method((message) => ({ method: "startSession", ...message }))
        this.checkStatus = this.method((message) => ({ method: "checkStatus", ...message }))
    }

    pod(): SessionActionPod {
        return {
            initStartSession: () => (fields, post) => this.startSession.call({ fields }, post),
            initCheckStatus: () => (sessionID, post) => this.checkStatus.call({ sessionID }, post),
        }
    }
    resolve(response: SessionActionProxyResponse): void {
        switch (response.method) {
            case "startSession":
                this.startSession.resolve(response)
                break

            case "checkStatus":
                this.checkStatus.resolve(response)
                break

            default:
                assertNever(response)
        }
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}

interface Post<M> {
    (message: M): void
}
