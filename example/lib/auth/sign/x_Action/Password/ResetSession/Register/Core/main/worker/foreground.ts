import { newRegisterPasswordLocationInfo } from "../../../../../../../password/resetSession/register/main"
import { newRegisterPasswordAction_merge } from "../core"

import { RegisterPasswordAction } from "../../action"

import { RegisterPasswordLocationInfo } from "../../../../../../../password/resetSession/register/method"

import {
    WorkerProxy,
    WorkerAbstractProxy,
} from "../../../../../../../../../z_getto/application/worker/foreground"

import {
    RegisterPasswordProxyMessage,
    RegisterPasswordProxyMethod,
    RegisterPasswordProxyResponse,
} from "./message"

export type RegisterPasswordProxy = WorkerProxy<
    RegisterPasswordAction,
    RegisterPasswordProxyMessage,
    RegisterPasswordProxyResponse
>
export function newRegisterPasswordProxy(
    webStorage: Storage,
    post: Post<RegisterPasswordProxyMessage>
): RegisterPasswordProxy {
    return new Proxy({ webStorage, locationInfo: newRegisterPasswordLocationInfo() }, post)
}

type Infra = Readonly<{
    webStorage: Storage
    locationInfo: RegisterPasswordLocationInfo
}>
class Proxy
    extends WorkerAbstractProxy<RegisterPasswordProxyMessage>
    implements RegisterPasswordProxy {
    infra: Infra
    register: RegisterPasswordProxyMethod

    constructor(infra: Infra, post: Post<RegisterPasswordProxyMessage>) {
        super(post)
        this.infra = infra
        this.register = this.method("register", (message) => message)
    }

    background(): RegisterPasswordAction {
        return newRegisterPasswordAction_merge(this.infra.webStorage, {
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
    resolve(response: RegisterPasswordProxyResponse): void {
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
