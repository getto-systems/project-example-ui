import { newRegisterPasswordLocationInfo } from "../../../../main"

import {
    WorkerAbstractProxy,
    WorkerProxy,
} from "../../../../../../../../../z_getto/application/worker/foreground"

import {
    RegisterPasswordProxyMaterial,
    RegisterPasswordProxyMessage,
    RegisterPasswordProxyResponse,
} from "./message"

import { RegisterPasswordCoreBackground } from "../../Core/action"

import { RegisterPasswordLocationInfo } from "../../../../method"

export type RegisterPasswordProxy = WorkerProxy<
    RegisterPasswordCoreBackground,
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
    material: RegisterPasswordProxyMaterial

    constructor(infra: Infra, post: Post<RegisterPasswordProxyMessage>) {
        super(post)
        this.infra = infra
        this.material = {
            reset: this.method("register", (message) => message),
        }
    }

    background(): RegisterPasswordCoreBackground {
        return {
            register: (fields, post) =>
                this.material.reset.call(
                    {
                        fields,
                        resetToken: this.infra.locationInfo.getPasswordResetToken(),
                    },
                    post
                ),
        }
    }
    resolve(response: RegisterPasswordProxyResponse): void {
        switch (response.method) {
            case "register":
                this.material.reset.resolve(response)
                break
        }
    }
}

interface Post<M> {
    (message: M): void
}
