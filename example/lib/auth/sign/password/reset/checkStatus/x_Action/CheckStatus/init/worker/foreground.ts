import {
    WorkerAbstractProxy,
    WorkerProxy,
} from "../../../../../../../../../z_vendor/getto-application/action/worker/foreground"

import {
    CheckPasswordResetSendingStatusProxyMaterial,
    CheckPasswordResetSendingStatusProxyMessage,
    CheckPasswordResetSendingStatusProxyResponse,
} from "./message"

import { CheckPasswordResetSendingStatusEntryPoint } from "../../action"
import { initCheckSendingStatusAction, toEntryPoint } from "../../impl"
import { newCheckSendingStatusLocationDetecter } from "../../../../init"

export interface CheckPasswordResetSendingStatusProxy
    extends WorkerProxy<
        CheckPasswordResetSendingStatusProxyMessage,
        CheckPasswordResetSendingStatusProxyResponse
    > {
    entryPoint(currentLocation: Location): CheckPasswordResetSendingStatusEntryPoint
}
export function newCheckPasswordResetSendingStatusProxy(
    post: Post<CheckPasswordResetSendingStatusProxyMessage>,
): CheckPasswordResetSendingStatusProxy {
    return new Proxy(post)
}

class Proxy
    extends WorkerAbstractProxy<
        CheckPasswordResetSendingStatusProxyMessage,
        CheckPasswordResetSendingStatusProxyResponse
    >
    implements CheckPasswordResetSendingStatusProxy {
    material: CheckPasswordResetSendingStatusProxyMaterial

    constructor(post: Post<CheckPasswordResetSendingStatusProxyMessage>) {
        super(post)
        this.material = {
            checkStatus: this.method("checkStatus", (message) => message),
        }
    }

    entryPoint(currentLocation: Location): CheckPasswordResetSendingStatusEntryPoint {
        const detecter = newCheckSendingStatusLocationDetecter(currentLocation)
        return toEntryPoint(
            initCheckSendingStatusAction({
                checkStatus: (post) => this.material.checkStatus.call(detecter(), post),
            }),
        )
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
