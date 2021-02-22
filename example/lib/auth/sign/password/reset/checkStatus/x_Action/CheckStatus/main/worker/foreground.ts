import {
    WorkerAbstractProxy,
    WorkerProxy,
} from "../../../../../../../../../z_getto/application/worker/foreground"

import {
    CheckPasswordResetSendingStatusProxyMaterial,
    CheckPasswordResetSendingStatusProxyMessage,
    CheckPasswordResetSendingStatusProxyResponse,
} from "./message"

import { CheckPasswordResetSendingStatusMaterialPod } from "../../action"

export type CheckPasswordResetSendingStatusProxy = WorkerProxy<
    CheckPasswordResetSendingStatusMaterialPod,
    CheckPasswordResetSendingStatusProxyMessage,
    CheckPasswordResetSendingStatusProxyResponse
>
export function newCheckPasswordResetSendingStatusProxy(
    post: Post<CheckPasswordResetSendingStatusProxyMessage>,
): CheckPasswordResetSendingStatusProxy {
    return new Proxy(post)
}

class Proxy
    extends WorkerAbstractProxy<CheckPasswordResetSendingStatusProxyMessage>
    implements CheckPasswordResetSendingStatusProxy {
    material: CheckPasswordResetSendingStatusProxyMaterial

    constructor(post: Post<CheckPasswordResetSendingStatusProxyMessage>) {
        super(post)
        this.material = {
            checkStatus: this.method("checkStatus", (message) => message),
        }
    }

    pod(): CheckPasswordResetSendingStatusMaterialPod {
        return {
            initCheckStatus: (locationInfo) => (post) =>
                this.material.checkStatus.call(
                    { sessionID: locationInfo.getPasswordResetSessionID() },
                    post,
                ),
        }
    }
    resolve(response: CheckPasswordResetSendingStatusProxyResponse): void {
        switch (response.method) {
            case "checkStatus":
                this.material.checkStatus.resolve(response)
                break
        }
    }
}

interface Post<M> {
    (message: M): void
}
