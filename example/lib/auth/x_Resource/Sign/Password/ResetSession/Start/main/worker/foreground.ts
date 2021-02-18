import { newStartPasswordResetSessionProxy } from "../../../../../../../sign/x_Action/Password/ResetSession/Start/Core/main/worker/foreground"

import { newStartPasswordResetSessionResource_merge } from "../core"

import {
    StartPasswordResetSessionResourceProxyMessage,
    StartPasswordResetSessionResourceProxyResponse,
} from "./message"

import { StartPasswordResetSessionResource } from "../../resource"

export type StartPasswordResetSessionResourceProxy = Readonly<{
    resource: StartPasswordResetSessionResource
    resolve: Resolve<StartPasswordResetSessionResourceProxyResponse>
}>

export function newStartPasswordResetSessionResourceProxy(
    post: Post<StartPasswordResetSessionResourceProxyMessage>
): StartPasswordResetSessionResourceProxy {
    const proxy = {
        start: newStartPasswordResetSessionProxy((message) => post({ type: "start", message })),
    }
    return {
        resource: newStartPasswordResetSessionResource_merge({
            start: proxy.start.background(),
        }),
        resolve: (response) => {
            switch (response.type) {
                case "start":
                    proxy.start.resolve(response.response)
                    return
            }
        },
    }
}

interface Post<M> {
    (message: M): void
}
interface Resolve<R> {
    (response: R): void
}
