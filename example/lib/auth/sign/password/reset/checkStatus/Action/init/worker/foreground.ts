import { newCheckResetTokenSendingStatusLocationDetecter } from "../../../impl/init"

import { toCheckResetTokenSendingStatusEntryPoint } from "../../impl"
import { initCheckResetTokenSendingStatusCoreAction } from "../../Core/impl"

import {
    WorkerAbstractProxy,
    WorkerProxy,
} from "../../../../../../../../z_vendor/getto-application/action/worker/foreground"

import {
    CheckPasswordResetSendingStatusProxyMaterial,
    CheckPasswordResetSendingStatusProxyMessage,
    CheckPasswordResetSendingStatusProxyResponse,
} from "./message"

import { CheckResetTokenSendingStatusEntryPoint } from "../../entryPoint"

export interface CheckPasswordResetSendingStatusProxy
    extends WorkerProxy<
        CheckPasswordResetSendingStatusProxyMessage,
        CheckPasswordResetSendingStatusProxyResponse
    > {
    entryPoint(currentLocation: Location): CheckResetTokenSendingStatusEntryPoint
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

    entryPoint(currentLocation: Location): CheckResetTokenSendingStatusEntryPoint {
        const detecter = newCheckResetTokenSendingStatusLocationDetecter(currentLocation)
        return toCheckResetTokenSendingStatusEntryPoint(
            initCheckResetTokenSendingStatusCoreAction({
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
