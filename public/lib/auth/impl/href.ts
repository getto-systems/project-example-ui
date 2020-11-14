import { AuthHref } from "../href"

export function initAuthHref(): AuthHref {
    return {
        passwordLoginHref,
        passwordResetSessionHref,
    }
}

// ログイン前画面ではアンダースコアから始まるクエリを使用する
export const AuthSearch = {
    passwordLogin: "_password_login",
    passwordReset: "_password_reset",
    passwordResetToken: "_password_reset_token",
}

function passwordLoginHref(): string {
    return `?${AuthSearch.passwordLogin}`
}
function passwordResetSessionHref(): string {
    return `?${AuthSearch.passwordReset}=start`
}
