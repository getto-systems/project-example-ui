import { LoginViewLocationInfo } from "./core"

import { ViewState } from "../entryPoint"

import { AuthSearchParams } from "../../../../common/searchParams/data"

export function initLoginViewLocationInfo(currentURL: URL): LoginViewLocationInfo {
    return {
        login: {
            getLoginView: () => detectViewState(currentURL),
        },
    }
}

function detectViewState(currentURL: URL): ViewState {
    // パスワードリセット
    switch (currentURL.searchParams.get(AuthSearchParams.passwordReset)) {
        case AuthSearchParams.passwordReset_start:
            return "password-reset-session"
        case AuthSearchParams.passwordReset_reset:
            return "password-reset"
    }

    // 特に指定が無ければパスワードログイン
    return "password-login"
}
