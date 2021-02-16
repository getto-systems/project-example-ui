import {
    WorkerForegroundProxyAction_legacy,
    WorkerForegroundProxyBase,
    WorkerForegroundProxyMethod,
} from "../../../../../../../common/vendor/getto-worker/main/foreground"

import {
    PasswordResetRegisterActionProxyMessage,
    PasswordResetRegisterActionProxyResponse,
    SubmitPasswordResetRegisterProxyParams,
} from "./message"

import { PasswordResetRegisterActionPod } from "../../action"

import { SubmitPasswordResetRegisterEvent } from "../../event"

export function newPasswordResetRegisterActionForegroundProxy(
    post: Post<PasswordResetRegisterActionProxyMessage>
): RegisterActionForegroundProxy {
    return new Proxy(post)
}
export type RegisterActionForegroundProxy = WorkerForegroundProxyAction_legacy<
    PasswordResetRegisterActionPod,
    PasswordResetRegisterActionProxyMessage,
    PasswordResetRegisterActionProxyResponse
>

class Proxy
    extends WorkerForegroundProxyBase<PasswordResetRegisterActionProxyMessage>
    implements RegisterActionForegroundProxy {
    submit: WorkerForegroundProxyMethod<
        SubmitPasswordResetRegisterProxyParams,
        SubmitPasswordResetRegisterEvent
    >

    constructor(post: Post<PasswordResetRegisterActionProxyMessage>) {
        super(post)
        this.submit = this.method((message) => ({ method: "submit", ...message }))
    }

    pod(): PasswordResetRegisterActionPod {
        return {
            initSubmit: (locationInfo) => (fields, post) =>
                this.submit.call({ fields, resetToken: locationInfo.getPasswordResetToken() }, post),
        }
    }
    resolve(response: PasswordResetRegisterActionProxyResponse): void {
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
