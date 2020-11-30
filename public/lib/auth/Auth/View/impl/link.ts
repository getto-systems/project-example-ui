import { AuthLink } from "../../link"

export function initAuthLink(): AuthLink {
    return {
        passwordLogin,
        passwordResetSession,
    }
}

// ログイン前画面ではアンダースコアから始まるクエリを使用する
export const AuthSearch = {
    passwordLogin: "_password_login",
    passwordReset: "_password_reset",
    passwordReset_start: "start",
    passwordReset_reset: "reset",
    passwordResetToken: "_password_reset_token",
}

function passwordLogin(): string {
    return `?${AuthSearch.passwordLogin}`
}
function passwordResetSession(): string {
    return `?${AuthSearch.passwordReset}=${AuthSearch.passwordReset_start}`
}
