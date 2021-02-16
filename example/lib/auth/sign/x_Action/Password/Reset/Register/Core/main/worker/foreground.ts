import { newRegisterPasswordResetSessionLocationInfo } from "../../../../../../../password/resetSession/register/main"
import { newRegisterPasswordResetSessionAction_merge } from "../core"

import { RegisterPasswordResetSessionAction } from "../../action"

import { RegisterPasswordResetSessionLocationInfo } from "../../../../../../../password/resetSession/register/method"

import { RegisterPasswordResetSessionEvent } from "../../../../../../../password/resetSession/register/event"

import {
    WorkerForegroundProxyAction,
    WorkerForegroundProxyBase,
    WorkerForegroundProxyMethod,
} from "../../../../../../../../../common/vendor/getto-worker/main/foreground"

import {
    RegisterPasswordResetSessionProxyMessage,
    RegisterPasswordResetSessionProxyParams,
    RegisterPasswordResetSessionProxyResponse,
} from "./message"

export type RegisterPasswordResetSessionActionProxyInfra = Readonly<{
    webStorage: Storage
    locationInfo: RegisterPasswordResetSessionLocationInfo
}>
export function newRegisterPasswordResetSessionActionProxy(
    webStorage: Storage,
    post: Post<RegisterPasswordResetSessionProxyMessage>
): RegisterPasswordResetSessionActionProxy {
    return new Proxy(
        { webStorage, locationInfo: newRegisterPasswordResetSessionLocationInfo() },
        post
    )
}
export type RegisterPasswordResetSessionActionProxy = WorkerForegroundProxyAction<
    RegisterPasswordResetSessionAction,
    RegisterPasswordResetSessionProxyMessage,
    RegisterPasswordResetSessionProxyResponse
>

class Proxy
    extends WorkerForegroundProxyBase<RegisterPasswordResetSessionProxyMessage>
    implements RegisterPasswordResetSessionActionProxy {
    infra: RegisterPasswordResetSessionActionProxyInfra
    register: WorkerForegroundProxyMethod<
        RegisterPasswordResetSessionProxyParams,
        RegisterPasswordResetSessionEvent
    >

    constructor(
        infra: RegisterPasswordResetSessionActionProxyInfra,
        post: Post<RegisterPasswordResetSessionProxyMessage>
    ) {
        super(post)
        this.infra = infra
        this.register = this.method((message) => ({
            method: "register",
            ...message,
        }))
    }

    action(): RegisterPasswordResetSessionAction {
        return newRegisterPasswordResetSessionAction_merge(this.infra.webStorage, {
            register: (fields, post) =>
                this.register.call(
                    {
                        fields,
                        resetToken: this.infra.locationInfo.getPasswordResetToken(),
                    },
                    post
                ),
        })
    }
    resolve(response: RegisterPasswordResetSessionProxyResponse): void {
        switch (response.method) {
            case "register":
                this.register.resolve(response)
                break
        }
    }
}

interface Post<M> {
    (message: M): void
}
