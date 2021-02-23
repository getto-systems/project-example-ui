import {
    WorkerAbstractProxy,
    WorkerProxy_legacy,
} from "../../../../../../../../../z_getto/application/worker/foreground"

import {
    ResetPasswordProxyMaterial,
    ResetPasswordProxyMessage,
    ResetPasswordProxyResponse,
} from "./message"

import { ResetPasswordCoreBackgroundPod } from "../../Core/action"

export type ResetPasswordProxy = WorkerProxy_legacy<
    ResetPasswordCoreBackgroundPod,
    ResetPasswordProxyMessage,
    ResetPasswordProxyResponse
>
export function newResetPasswordProxy(
    webStorage: Storage,
    post: Post<ResetPasswordProxyMessage>,
): ResetPasswordProxy {
    return new Proxy({ webStorage }, post)
}

type Infra = Readonly<{
    webStorage: Storage
}>
class Proxy
    extends WorkerAbstractProxy<ResetPasswordProxyMessage>
    implements ResetPasswordProxy {
    infra: Infra
    material: ResetPasswordProxyMaterial

    constructor(infra: Infra, post: Post<ResetPasswordProxyMessage>) {
        super(post)
        this.infra = infra
        this.material = {
            reset: this.method("reset", (message) => message),
        }
    }

    pod(): ResetPasswordCoreBackgroundPod {
        return {
            initReset: (locationInfo) => (fields, post) =>
                this.material.reset.call(
                    {
                        fields,
                        resetToken: locationInfo.getPasswordResetToken(),
                    },
                    post,
                ),
        }
    }
    resolve(response: ResetPasswordProxyResponse): void {
        switch (response.method) {
            case "reset":
                this.material.reset.resolve(response)
                break
        }
    }
}

interface Post<M> {
    (message: M): void
}
