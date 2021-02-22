import {
    WorkerAbstractProxy,
    WorkerProxy,
} from "../../../../../../../../../z_getto/application/worker/foreground"

import {
    RegisterPasswordProxyMaterial,
    RegisterPasswordProxyMessage,
    RegisterPasswordProxyResponse,
} from "./message"

import { RegisterPasswordCoreBackgroundPod } from "../../Core/action"

export type RegisterPasswordProxy = WorkerProxy<
    RegisterPasswordCoreBackgroundPod,
    RegisterPasswordProxyMessage,
    RegisterPasswordProxyResponse
>
export function newRegisterPasswordProxy(
    webStorage: Storage,
    post: Post<RegisterPasswordProxyMessage>,
): RegisterPasswordProxy {
    return new Proxy({ webStorage }, post)
}

type Infra = Readonly<{
    webStorage: Storage
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

    pod(): RegisterPasswordCoreBackgroundPod {
        return {
            initRegister: (locationInfo) => (fields, post) =>
                this.material.reset.call(
                    {
                        fields,
                        resetToken: locationInfo.getPasswordResetToken(),
                    },
                    post,
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
