import {
    WorkerForegroundProxyAction,
    WorkerForegroundProxyBase,
    WorkerForegroundProxyMethod,
} from "../../../../../../common/getto-worker/worker/foreground"

import { RegisterActionProxyMessage, RegisterActionProxyResponse, SubmitProxyParams } from "./message"

import { RegisterActionPod } from "../action"

import { SubmitEvent } from "../event"

export function newRegisterActionForegroundProxy(
    post: Post<RegisterActionProxyMessage>
): RegisterActionForegroundProxy {
    return new Proxy(post)
}
export type RegisterActionForegroundProxy = WorkerForegroundProxyAction<
    RegisterActionPod,
    RegisterActionProxyMessage,
    RegisterActionProxyResponse
>

class Proxy
    extends WorkerForegroundProxyBase<RegisterActionProxyMessage>
    implements RegisterActionForegroundProxy {
    submit: WorkerForegroundProxyMethod<SubmitProxyParams, SubmitEvent>

    constructor(post: Post<RegisterActionProxyMessage>) {
        super(post)
        this.submit = this.method((message) => ({ method: "submit", ...message }))
    }

    pod(): RegisterActionPod {
        return {
            initSubmit: (locationInfo) => (fields, post) =>
                this.submit.call({ fields, resetToken: locationInfo.getResetToken() }, post),
        }
    }
    resolve(response: RegisterActionProxyResponse): void {
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
