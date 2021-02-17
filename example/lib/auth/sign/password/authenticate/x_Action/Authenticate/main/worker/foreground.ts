import { newAuthenticatePasswordProxy } from "../../Core/main/worker/foreground"
import { newPasswordAuthenticateResource_merge } from "../core"

import { AuthenticatePasswordResource } from "../../resource"

import {
    AuthenticatePasswordResourceProxyMessage,
    AuthenticatePasswordResourceProxyResponse,
} from "./message"

export type AuthenticatePasswordResourceProxy = Readonly<{
    resource: AuthenticatePasswordResource
    resolve: Resolve<AuthenticatePasswordResourceProxyResponse>
}>

export function newAuthenticatePasswordResourceProxy(
    webStorage: Storage,
    post: Post<AuthenticatePasswordResourceProxyMessage>
): AuthenticatePasswordResourceProxy {
    const proxy = {
        authenticate: newAuthenticatePasswordProxy(webStorage, (message) =>
            post({ type: "authenticate", message })
        ),
    }
    return {
        resource: newPasswordAuthenticateResource_merge({
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
