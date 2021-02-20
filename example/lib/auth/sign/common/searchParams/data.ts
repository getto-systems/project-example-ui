// ログイン前画面ではアンダースコアから始まるクエリを使用する
export const AuthSignSearchParams = {
    // TODO 階層構造を反映した名前にする
    passwordLogin: "_password_login",
    passwordReset: "_password_reset",
    passwordReset_start: "start",
    passwordReset_reset: "reset",
    passwordResetToken: "_password_reset_token",
} as const
