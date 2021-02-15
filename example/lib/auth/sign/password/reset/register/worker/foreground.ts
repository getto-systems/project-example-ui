import {
    WorkerForegroundProxyAction,
    WorkerForegroundProxyBase,
    WorkerForegroundProxyMethod,
} from "../../../../../../vendor/getto-worker/worker/foreground"

import { RegisterActionProxyMessage, RegisterActionProxyResponse, SubmitProxyParams } from "./message"

import { PasswordResetRegisterActionPod } from "../action"

import { SubmitPasswordResetRegisterEvent } from "../event"

export function newRegisterActionForegroundProxy(
    post: Post<RegisterActionProxyMessage>
): RegisterActionForegroundProxy {
    return new Proxy(post)
}
export type RegisterActionForegroundProxy = WorkerForegroundProxyAction<
    PasswordResetRegisterActionPod,
    RegisterActionProxyMessage,
    RegisterActionProxyResponse
>

class Proxy
    extends WorkerForegroundProxyBase<RegisterActionProxyMessage>
    implements RegisterActionForegroundProxy {
    submit: WorkerForegroundProxyMethod<SubmitProxyParams, SubmitPasswordResetRegisterEvent>

    constructor(post: Post<RegisterActionProxyMessage>) {
        super(post)
        this.submit = this.method((message) => ({ method: "submit", ...message }))
    }

    pod(): PasswordResetRegisterActionPod {
        return {
            initSubmit: (locationInfo) => (fields, post) =>
                this.submit.call({ fields, resetToken: locationInfo.getPasswordResetToken() }, post),
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
