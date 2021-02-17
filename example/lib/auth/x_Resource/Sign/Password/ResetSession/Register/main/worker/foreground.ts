import { newRegisterPasswordResource_merge } from "../core"

import {
    RegisterPasswordResourceProxyMessage,
    RegisterPasswordResourceProxyResponse,
} from "./message"
import { newRegisterPasswordProxy } from "../../../../../../../sign/x_Action/Password/ResetSession/Register/Core/main/worker/foreground"
import { RegisterPasswordResource } from "../../resource"

export type RegisterPasswordResourceProxy = Readonly<{
    resource: RegisterPasswordResource
    resolve: Resolve<RegisterPasswordResourceProxyResponse>
}>

export function newRegisterPasswordResourceProxy(
    webStorage: Storage,
    post: Post<RegisterPasswordResourceProxyMessage>
): RegisterPasswordResourceProxy {
    const proxy = {
        register: newRegisterPasswordProxy(webStorage, (message) =>
            post({ type: "register", message })
        ),
    }
    return {
        resource: newRegisterPasswordResource_merge({
            register: proxy.register.action(),
        }),
        resolve: (response) => {
            switch (response.type) {
                case "register":
                    proxy.register.resolve(response.response)
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
