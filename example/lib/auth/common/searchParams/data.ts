// ログイン前画面ではアンダースコアから始まるクエリを使用する
export const AuthSearchParams = {
    passwordLogin: "_password_login",
    passwordReset: "_password_reset",
    passwordReset_start: "start",
    passwordReset_reset: "reset",
    passwordResetToken: "_password_reset_token",
} as const
