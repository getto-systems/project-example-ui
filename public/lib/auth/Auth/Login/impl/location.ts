import { ViewState } from "../view"

import { LoginSearch } from "./link"

import { markPagePathname, PagePathname } from "../../../common/application/data"
import { markResetToken, ResetToken } from "../../../profile/password_reset/data"

export function detectViewState(currentLocation: Location): ViewState {
    const url = new URL(currentLocation.toString())

    // パスワードリセット
    switch (url.searchParams.get(LoginSearch.passwordReset)) {
        case LoginSearch.passwordReset_start:
            return "password-reset-session"
        case LoginSearch.passwordReset_reset:
            return "password-reset"
    }

    // 特に指定が無ければパスワードログイン
    return "password-login"
}
export function detectResetToken(currentLocation: Location): ResetToken {
    const url = new URL(currentLocation.toString())
    return markResetToken(url.searchParams.get(LoginSearch.passwordResetToken) || "")
}
export function currentPagePathname(currentLocation: Location): PagePathname {
    return markPagePathname(new URL(currentLocation.toString()).pathname)
}
