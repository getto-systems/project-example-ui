import { newAuthenticatePasswordActionProxy } from "../../../../../../../sign/x_Action/Password/Authenticate/Core/main/worker/foreground"
import { newAuthSignPasswordAuthenticateResource_merge } from "../core"

import { AuthSignPasswordAuthenticateResource } from "../../resource"

import {
    AuthSignPasswordAuthenticateProxyMessage,
    AuthSignPasswordAuthenticateProxyResponse,
} from "./message"

export type AuthSignPasswordAuthenticateProxy = Readonly<{
    resource: AuthSignPasswordAuthenticateResource
    resolve: Resolve<AuthSignPasswordAuthenticateProxyResponse>
}>

export function newAuthSignPasswordAuthenticateProxy(
    webStorage: Storage,
    post: Post<AuthSignPasswordAuthenticateProxyMessage>
): AuthSignPasswordAuthenticateProxy {
    const proxy = {
        authenticate: newAuthenticatePasswordActionProxy(webStorage, (message) =>
            post({ type: "authenticate", message })
        ),
    }
    return {
        resource: newAuthSignPasswordAuthenticateResource_merge({
            authenticate: proxy.authenticate.action(),
        }),
        resolve: (response) => {
            switch (response.type) {
                case "authenticate":
                    proxy.authenticate.resolve(response.response)
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
