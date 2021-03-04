import { AuthSignLinkResource } from "./action"

import { authSignHref_password_authenticate, authSignHref_password_reset } from "../../data"

export function newAuthSignLinkResource(): AuthSignLinkResource {
    return {
        href: {
            password_authenticate: () => authSignHref_password_authenticate(),
            password_reset: () => authSignHref_password_reset("requestToken"),
        },
    }
}
