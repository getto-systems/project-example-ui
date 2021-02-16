export type LocationPathname = string & { LocationPathname: never }
export function markLocationPathname(pathname: string): LocationPathname {
    return pathname as LocationPathname
}

export type SecureScriptPath = string & { SecureScriptPath: never }
export function markSecureScriptPath(path: string): SecureScriptPath {
    return path as SecureScriptPath
}

export type LoadSecureScriptError = Readonly<{ type: "infra-error"; err: string }>

// TODO これはここじゃない気がする
// ログイン前画面ではアンダースコアから始まるクエリを使用する
export const AuthLocationSearchParams = {
    passwordLogin: "_password_login",
    passwordReset: "_password_reset",
    passwordReset_start: "start",
    passwordReset_reset: "reset",
    passwordResetToken: "_password_reset_token",
} as const
