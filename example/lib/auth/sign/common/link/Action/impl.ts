import { SignLinkResource } from "./action"

import { SignHref, signLinkParams } from "../data"
import { ResetSessionID } from "../../../password/reset/kernel/data"

export function newSignLinkResource(): SignLinkResource {
    return {
        href: {
            password_authenticate,
            password_reset_requestToken,
            password_reset_checkStatus,
        },
    }
}

type Search<K extends string> = Readonly<{
    key: string
    variant: Record<K, true>
}>

function password_authenticate(): SignHref {
    return searchQuery(signLinkParams.password.authenticate, "authenticate", [])
}
function password_reset_checkStatus(sessionID: ResetSessionID): SignHref {
    const search = signLinkParams.password.reset
    return searchQuery(search, "checkStatus", [[search.sessionID, sessionID]])
}
function password_reset_requestToken(): SignHref {
    return searchQuery(signLinkParams.password.reset, "requestToken", [])
}

function searchQuery<K extends string>(
    keys: Search<K>,
    target: K,
    query: [string, string][],
): SignHref {
    return markSignHref(
        [
            `?${keys.key}=${target}`,
            ...query.map((param) => {
                const [key, value] = param
                return `${key}=${value}`
            }),
        ].join("&"),
    )
}

function markSignHref(href: string): SignHref {
    return href as SignHref
}
