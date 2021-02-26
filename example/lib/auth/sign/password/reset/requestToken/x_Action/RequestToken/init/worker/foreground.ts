import { toAction, toEntryPoint } from "../../impl"
import { initCoreAction } from "../../Core/impl"
import { initFormAction } from "../../Form/impl"

import {
    WorkerAbstractProxy,
    WorkerProxy,
} from "../../../../../../../../../z_vendor/getto-application/action/worker/foreground"

import {
    RequestPasswordResetTokenProxyMaterial,
    RequestPasswordResetTokenProxyMessage,
    RequestPasswordResetTokenProxyResponse,
} from "./message"

import { CoreAction } from "../../Core/action"

import { RequestPasswordResetTokenEntryPoint } from "../../action"
import { FormAction } from "../../Form/action"

export interface RequestPasswordResetTokenProxy
    extends WorkerProxy<
        RequestPasswordResetTokenProxyMessage,
        RequestPasswordResetTokenProxyResponse
    > {
    entryPoint(): RequestPasswordResetTokenEntryPoint
}
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
            requestToken: this.method("requestToken", (message) => message),
        }
    }

    entryPoint(): RequestPasswordResetTokenEntryPoint {
        return newEntryPoint(
            initCoreAction({
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

export function newEntryPoint(action: CoreAction): RequestPasswordResetTokenEntryPoint {
    return toEntryPoint(
        toAction({
            core: action,
            form: newFormAction(),
        }),
    )
}

function newFormAction(): FormAction {
    return initFormAction()
}

interface Post<M> {
    (message: M): void
}
