import { newAuthSignPasswordResetSessionRegisterResource_merge } from "../core"

import {
    AuthSignPasswordResetSessionRegisterProxyMessage,
    AuthSignPasswordResetSessionRegisterProxyResponse,
} from "./message"
import { newRegisterPasswordResetSessionActionProxy } from "../../../../../../../../sign/x_Action/Password/Reset/Register/Core/main/worker/foreground"
import { AuthSignPasswordResetSessionRegisterResource } from "../../resource"

export type AuthSignPasswordResetSessionRegisterProxy = Readonly<{
    resource: AuthSignPasswordResetSessionRegisterResource
    resolve: Resolve<AuthSignPasswordResetSessionRegisterProxyResponse>
}>

export function newAuthSignPasswordResetSessionRegisterProxy(
    webStorage: Storage,
    post: Post<AuthSignPasswordResetSessionRegisterProxyMessage>
): AuthSignPasswordResetSessionRegisterProxy {
    const proxy = {
        register: newRegisterPasswordResetSessionActionProxy(webStorage, (message) =>
            post({ type: "register", message })
        ),
    }
    return {
        resource: newAuthSignPasswordResetSessionRegisterResource_merge({
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
