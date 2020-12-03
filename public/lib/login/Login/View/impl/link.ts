import { LoginLink } from "../../link"

export function initLoginLink(): LoginLink {
    return {
        passwordLogin,
        passwordResetSession,
    }
}

// ログイン前画面ではアンダースコアから始まるクエリを使用する
export const LoginSearch = {
    passwordLogin: "_password_login",
    passwordReset: "_password_reset",
    passwordReset_start: "start",
    passwordReset_reset: "reset",
    passwordResetToken: "_password_reset_token",
}

function passwordLogin(): string {
    return `?${LoginSearch.passwordLogin}`
}
function passwordResetSession(): string {
    return `?${LoginSearch.passwordReset}=${LoginSearch.passwordReset_start}`
}
