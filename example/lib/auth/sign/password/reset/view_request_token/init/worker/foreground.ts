import { initRequestResetTokenEntryPoint } from "../../impl"
import { initRequestResetTokenCoreAction } from "../../core/impl"
import { initRequestResetTokenFormAction } from "../../form/impl"

import {
    WorkerAbstractProxy,
    WorkerProxy,
} from "../../../../../../../z_vendor/getto-application/action/worker/foreground"

import {
    RequestPasswordResetTokenProxyMaterial,
    RequestPasswordResetTokenProxyMessage,
    RequestPasswordResetTokenProxyResponse,
} from "./message"

import { RequestResetTokenCoreAction } from "../../core/action"

import { RequestResetTokenEntryPoint } from "../../entry_point"

export interface RequestPasswordResetTokenProxy
    extends WorkerProxy<
        RequestPasswordResetTokenProxyMessage,
        RequestPasswordResetTokenProxyResponse
    > {
    entryPoint(): RequestResetTokenEntryPoint
}
export function newRequestPasswordResetTokenProxy(
    post: Post<RequestPasswordResetTokenProxyMessage>,
): RequestPasswordResetTokenProxy {
    return new Proxy(post)
}

class Proxy
    extends WorkerAbstractProxy<
        RequestPasswordResetTokenProxyMessage,
        RequestPasswordResetTokenProxyResponse
    >
    implements RequestPasswordResetTokenProxy {
    material: RequestPasswordResetTokenProxyMaterial

    constructor(post: Post<RequestPasswordResetTokenProxyMessage>) {
        super(post)
        this.material = {
            requestToken: this.method("requestToken", (message) => message),
        }
    }

    entryPoint(): RequestResetTokenEntryPoint {
        return buildRequestResetTokenEntryPoint(
            initRequestResetTokenCoreAction({
                requestToken: (fields, post) => this.material.requestToken.call({ fields }, post),
            }),
        )
    }
    resolve(response: RequestPasswordResetTokenProxyResponse): void {
        switch (response.method) {
            case "requestToken":
                this.material.requestToken.resolve(response)
                return
        }
    }
}

export function buildRequestResetTokenEntryPoint(
    action: RequestResetTokenCoreAction,
): RequestResetTokenEntryPoint {
    return initRequestResetTokenEntryPoint({
        core: action,
        form: initRequestResetTokenFormAction(),
    })
}

interface Post<M> {
    (message: M): void
}
