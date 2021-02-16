import {
    WorkerForegroundProxyAction_legacy,
    WorkerForegroundProxyBase,
    WorkerForegroundProxyMethod,
} from "../../../../../../../common/vendor/getto-worker/main/foreground"

import {
    CheckPasswordResetSessionStatusProxyParams,
    PasswordResetSessionActionProxyMessage,
    PasswordResetSessionActionProxyResponse,
    StartPasswordResetSessionProxyParams,
} from "./message"

import { PasswordResetSessionActionPod } from "../../action"

import { CheckPasswordResetSessionStatusEvent, StartPasswordResetSessionEvent } from "../../event"

export function newPasswordResetSessionActionForegroundProxy(
    post: Post<PasswordResetSessionActionProxyMessage>
): PasswordResetSessionActionForegroundProxy {
    return new Proxy(post)
}
export type PasswordResetSessionActionForegroundProxy = WorkerForegroundProxyAction_legacy<
    PasswordResetSessionActionPod,
    PasswordResetSessionActionProxyMessage,
    PasswordResetSessionActionProxyResponse
>

class Proxy
    extends WorkerForegroundProxyBase<PasswordResetSessionActionProxyMessage>
    implements PasswordResetSessionActionForegroundProxy {
    start: WorkerForegroundProxyMethod<
        StartPasswordResetSessionProxyParams,
        StartPasswordResetSessionEvent
    >
    checkStatus: WorkerForegroundProxyMethod<
        CheckPasswordResetSessionStatusProxyParams,
        CheckPasswordResetSessionStatusEvent
    >

    constructor(post: Post<PasswordResetSessionActionProxyMessage>) {
        super(post)
        this.start = this.method((message) => ({ method: "start", ...message }))
        this.checkStatus = this.method((message) => ({ method: "checkStatus", ...message }))
    }

    pod(): PasswordResetSessionActionPod {
        return {
            initStart: () => (fields, post) => this.start.call({ fields }, post),
            initCheckStatus: () => (sessionID, post) => this.checkStatus.call({ sessionID }, post),
        }
    }
    resolve(response: PasswordResetSessionActionProxyResponse): void {
        switch (response.method) {
            case "start":
                this.start.resolve(response)
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
