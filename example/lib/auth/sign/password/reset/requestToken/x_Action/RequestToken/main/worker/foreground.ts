import {
    WorkerAbstractProxy,
    WorkerProxy_legacy,
} from "../../../../../../../../../z_getto/application/worker/foreground"

import {
    RequestPasswordResetTokenProxyMaterial,
    RequestPasswordResetTokenProxyMessage,
    RequestPasswordResetTokenProxyResponse,
} from "./message"

import { RequestPasswordResetTokenCoreMaterial } from "../../Core/action"

export type RequestPasswordResetTokenProxy = WorkerProxy_legacy<
    RequestPasswordResetTokenCoreMaterial,
    RequestPasswordResetTokenProxyMessage,
    RequestPasswordResetTokenProxyResponse
>
export function newRequestPasswordResetTokenProxy(
    post: Post<RequestPasswordResetTokenProxyMessage>,
): RequestPasswordResetTokenProxy {
    return new Proxy(post)
}

class Proxy
    extends WorkerAbstractProxy<RequestPasswordResetTokenProxyMessage>
    implements RequestPasswordResetTokenProxy {
    material: RequestPasswordResetTokenProxyMaterial

    constructor(post: Post<RequestPasswordResetTokenProxyMessage>) {
        super(post)
        this.material = {
            request: this.method("request", (message) => message),
        }
    }

    pod(): RequestPasswordResetTokenCoreMaterial {
        return {
            request: (fields, post) => this.material.request.call({ fields }, post),
        }
    }
    resolve(response: RequestPasswordResetTokenProxyResponse): void {
        switch (response.method) {
            case "request":
                this.material.request.resolve(response)
                return
        }
    }
}

interface Post<M> {
    (message: M): void
}
