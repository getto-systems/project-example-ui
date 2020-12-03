import { ViewState } from "../view"

import { AuthSearch } from "./link"

import { markPagePathname, PagePathname } from "../../../application/data"
import { markResetToken, ResetToken } from "../../../password_reset/data"

export function detectViewState(currentLocation: Location): ViewState {
    const url = new URL(currentLocation.toString())

    // パスワードリセット
    switch (url.searchParams.get(AuthSearch.passwordReset)) {
        case AuthSearch.passwordReset_start:
            return "password-reset-session"
        case AuthSearch.passwordReset_reset:
            return "password-reset"
    }

    // 特に指定が無ければパスワードログイン
    return "password-login"
}
export function detectResetToken(currentLocation: Location): ResetToken {
    const url = new URL(currentLocation.toString())
    return markResetToken(url.searchParams.get(AuthSearch.passwordResetToken) || "")
}
export function currentPagePathname(currentLocation: Location): PagePathname {
    return markPagePathname(new URL(currentLocation.toString()).pathname)
}
