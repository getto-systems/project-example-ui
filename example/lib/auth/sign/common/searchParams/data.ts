import { ResetSessionID } from "../../password/reset/kernel/data"

// ログイン前画面ではアンダースコアから始まるクエリを使用する
const authSignSearchParams = {
    password: {
        authenticate: { key: "_password_authenticate", variant: { authenticate: "authenticate" } },
        reset: {
            key: "_password_reset",
            variant: {
                request: "request",
                checkStatus: "checkStatus",
                reset: "reset",
            },
            sessionID: "_password_reset_session_id",
            token: "_password_reset_token",
        },
    },
} as const

type Search<K extends string> = Readonly<{
    key: string
    variant: Record<K, string>
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
            `?${keys.key}=${keys.variant[target]}`,
            ...query.map((param) => {
                const [key, value] = param
                return `${key}=${value}`
            }),
        ].join("&"),
    )
}

export function authSignSearchKey_password_reset_sessionID(): string {
    return authSignSearchParams.password.reset.sessionID
}
export function authSignSearchKey_password_reset_token(): string {
    return authSignSearchParams.password.reset.token
}

export type AuthSignSearchVariant<K extends string> = Readonly<{
    key: string
    variant: { (key: string): AuthSignSearchKeyFound<K> }
}>
export type AuthSignSearchKeyFound<K> =
    | Readonly<{ found: false }>
    | Readonly<{ found: true; key: K }>

export function authSignSearchVariant_password_reset(): AuthSignSearchVariant<
    Variant_password_reset
> {
    return authSignSearchVariant(authSignSearchParams.password.reset)
}
function authSignSearchVariant<K extends string>(search: Search<K>): AuthSignSearchVariant<K> {
    return {
        key: search.key,
        variant: (key) => {
            if (key in search.variant) {
                // key が variant のキーとして存在するなら key は K である : see Search["variant"]
                return { found: true, key: key as K }
            }
            return { found: false }
        },
    }
}
