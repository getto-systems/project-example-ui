import { ViewState } from "../entryPoint"

import { markPagePathname, PagePathname } from "../../../../common/application/data"
import { markResetToken, ResetToken } from "../../../../profile/passwordReset/data"

// ログイン前画面ではアンダースコアから始まるクエリを使用する
export const LoginSearch = {
    passwordLogin: "_password_login",
    passwordReset: "_password_reset",
    passwordReset_start: "start",
    passwordReset_reset: "reset",
    passwordResetToken: "_password_reset_token",
}

export function detectViewState(currentURL: URL): ViewState {
    // パスワードリセット
    switch (currentURL.searchParams.get(LoginSearch.passwordReset)) {
        case LoginSearch.passwordReset_start:
            return "password-reset-session"
        case LoginSearch.passwordReset_reset:
            return "password-reset"
    }

    // 特に指定が無ければパスワードログイン
    return "password-login"
}
export function detectResetToken(currentURL: URL): ResetToken {
    return markResetToken(currentURL.searchParams.get(LoginSearch.passwordResetToken) || "")
}
export function currentPagePathname(currentURL: URL): PagePathname {
    return markPagePathname(currentURL.pathname)
}
