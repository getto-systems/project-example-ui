import { ResetSessionID } from "../../password/reset/kernel/data"

// ログイン前画面ではアンダースコアから始まるクエリを使用する
export const authSignSearchParams = {
    password: {
        authenticate: {
            key: "_password_authenticate",
            variant: {
                authenticate: true,
            },
        },
        reset: {
            key: "_password_reset",
            variant: {
                requestToken: true,
                checkStatus: true,
                reset: true,
            },
            sessionID: "_password_reset_session_id",
            token: "_password_reset_token",
        },
    },
} as const

type Search<K extends string> = Readonly<{
    key: string
    variant: Record<K, true>
}>

type Variant_password_reset = keyof typeof authSignSearchParams["password"]["reset"]["variant"]

export type AuthSignHref = string & { AuthSignHref: never }
function markAuthSignHref(href: string): AuthSignHref {
    return href as AuthSignHref
}

export function authSignHref_password_authenticate(): AuthSignHref {
    return searchQuery(authSignSearchParams.password.authenticate, "authenticate", [])
}
export function authSignHref_password_reset_checkStatus(sessionID: ResetSessionID): AuthSignHref {
    const search = authSignSearchParams.password.reset
    return searchQuery(search, "checkStatus", [[search.sessionID, sessionID]])
}
export function authSignHref_password_reset(target: Variant_password_reset): AuthSignHref {
    return searchQuery(authSignSearchParams.password.reset, target, [])
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
