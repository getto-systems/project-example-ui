export type PagePathname = string & { PagePathname: never }
export function markPagePathname(pathname: string): PagePathname {
    return pathname as PagePathname
}

export type ScriptPath = string & { ScriptPath: never }
export function markScriptPath(path: string): ScriptPath {
    return path as ScriptPath
}

export type LoadError = Readonly<{ type: "infra-error"; err: string }>

// ログイン前画面ではアンダースコアから始まるクエリを使用する
export const AuthSearchParams = {
    passwordLogin: "_password_login",
    passwordReset: "_password_reset",
    passwordReset_start: "start",
    passwordReset_reset: "reset",
    passwordResetToken: "_password_reset_token",
} as const
