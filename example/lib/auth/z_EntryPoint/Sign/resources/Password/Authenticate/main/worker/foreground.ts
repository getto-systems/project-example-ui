import { newAuthenticatePasswordActionProxy } from "../../../../../../../sign/x_Action/Password/Authenticate/Core/main/worker/foreground"
import { newAuthSignPasswordAuthenticateResource_merge } from "../core"

import { AuthSignPasswordAuthenticateResource } from "../../resource"

import {
    AuthSignPasswordAuthenticateProxyMessage,
    AuthSignPasswordAuthenticateProxyResponse,
} from "./message"

export type AuthenticatePasswordProxy = Readonly<{
    resource: AuthSignPasswordAuthenticateResource
    resolve: Resolve<AuthSignPasswordAuthenticateProxyResponse>
}>

export function newAuthSignPasswordAuthenticateProxy(
    webStorage: Storage,
    post: Post<AuthSignPasswordAuthenticateProxyMessage>
): AuthenticatePasswordProxy {
    const proxy = {
        authenticate: newAuthenticatePasswordActionProxy((message) =>
            post({ type: "authenticate", message })
        ),
    }
    return {
        resource: newAuthSignPasswordAuthenticateResource_merge({
            authenticate: proxy.authenticate.action(webStorage),
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
