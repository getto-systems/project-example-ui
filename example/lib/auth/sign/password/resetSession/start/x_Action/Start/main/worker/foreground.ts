import {
    WorkerAbstractProxy,
    WorkerProxy,
} from "../../../../../../../../../z_getto/application/worker/foreground"

import {
    StartPasswordResetSessionProxyMaterial,
    StartPasswordResetSessionProxyMessage,
    StartPasswordResetSessionProxyResponse,
} from "./message"

import { StartPasswordResetSessionCoreMaterial } from "../../Core/action"

export type StartPasswordResetSessionProxy = WorkerProxy<
    StartPasswordResetSessionCoreMaterial,
    StartPasswordResetSessionProxyMessage,
    StartPasswordResetSessionProxyResponse
>
export function newStartPasswordResetSessionProxy(
    post: Post<StartPasswordResetSessionProxyMessage>,
): StartPasswordResetSessionProxy {
    return new Proxy(post)
}

class Proxy
    extends WorkerAbstractProxy<StartPasswordResetSessionProxyMessage>
    implements StartPasswordResetSessionProxy {
    material: StartPasswordResetSessionProxyMaterial

    constructor(post: Post<StartPasswordResetSessionProxyMessage>) {
        super(post)
        this.material = {
            start: this.method("start", (message) => message),
            checkStatus: this.method("checkStatus", (message) => message),
        }
    }

    pod(): StartPasswordResetSessionCoreMaterial {
        return {
            start: (fields, post) => this.material.start.call({ fields }, post),
            checkStatus: (sessionID, post) => this.material.checkStatus.call({ sessionID }, post),
        }
    }
    resolve(response: StartPasswordResetSessionProxyResponse): void {
        switch (response.method) {
            case "start":
                this.material.start.resolve(response)
                break

            case "checkStatus":
                this.material.checkStatus.resolve(response)
                break
        }
    }
}

interface Post<M> {
    (message: M): void
}
