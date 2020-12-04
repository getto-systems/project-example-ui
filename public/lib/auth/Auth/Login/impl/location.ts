import { ViewState } from "../view"

import { LoginSearch } from "./link"

import { markPagePathname, PagePathname } from "../../../common/application/data"
import { markResetToken, ResetToken } from "../../../profile/password_reset/data"

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
