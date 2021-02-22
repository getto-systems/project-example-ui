// ログイン前画面ではアンダースコアから始まるクエリを使用する
const authSignSearchParams = {
    password: {
        login: { key: "_password_login", variant: { login: "login" } },
        reset: {
            key: "_password_reset",
            variant: { start: "start", reset: "reset" },
            token: "_password_reset_token",
        },
    },
} as const

type Search<K extends string> = Readonly<{
    key: string
    variant: Record<K, string>
}>

type Variant_password_reset = keyof typeof authSignSearchParams["password"]["reset"]["variant"]

export function authSignSearch_password_login(): string {
    return search(authSignSearchParams.password.login, "login")
}
export function authSignSearch_password_reset(target: Variant_password_reset): string {
    return search(authSignSearchParams.password.reset, target)
}
function search<K extends string>(keys: Search<K>, target: K) {
    return `${keys.key}=${keys.variant[target]}`
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
