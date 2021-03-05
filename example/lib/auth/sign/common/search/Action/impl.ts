import { SignSearchResource } from "./action"

import { AuthSignHref, authSignSearchParams } from "../data"
import { ResetSessionID } from "../../../password/reset/kernel/data"

export function newSignSearchResource(): SignSearchResource {
    return {
        href: {
            password_authenticate: () => password_authenticate(),
            password_reset_requestToken: () => password_reset_requestToken(),
            password_reset_checkStatus: password_reset_checkStatus,
        },
    }
}

type Search<K extends string> = Readonly<{
    key: string
    variant: Record<K, true>
}>

function password_authenticate(): AuthSignHref {
    return searchQuery(authSignSearchParams.password.authenticate, "authenticate", [])
}
function password_reset_checkStatus(sessionID: ResetSessionID): AuthSignHref {
    const search = authSignSearchParams.password.reset
    return searchQuery(search, "checkStatus", [[search.sessionID, sessionID]])
}
function password_reset_requestToken(): AuthSignHref {
    return searchQuery(authSignSearchParams.password.reset, "requestToken", [])
}

function searchQuery<K extends string>(
    keys: Search<K>,
    target: K,
    query: [string, string][],
): AuthSignHref {
    return markAuthSignHref(
        [
            `?${keys.key}=${target}`,
            ...query.map((param) => {
                const [key, value] = param
                return `${key}=${value}`
            }),
        ].join("&"),
    )
}

function markAuthSignHref(href: string): AuthSignHref {
    return href as AuthSignHref
}
