import { packResetToken } from "../../password_reset/adapter"
import { packPagePathname } from "../../script/adapter"

import { AuthParam, AuthLocation } from "../infra"

import { AuthState } from "../usecase"

import { PagePathname } from "../../script/data"

export function initAuthLocation(currentLocation: Location): AuthLocation {
    return new AuthLocationImpl(currentLocation)
}

class AuthLocationImpl implements AuthLocation {
    currentLocation: Location

    constructor(currentLocation: Location) {
        this.currentLocation = currentLocation
    }

    detect(param: AuthParam): AuthState {
        // ログイン前画面ではアンダースコアから始まるクエリを使用する
        const url = new URL(this.currentLocation.toString())

        if (url.searchParams.get("_password_reset") === "start") {
            return { type: "password-reset-session" }
        }

        const resetToken = url.searchParams.get("_password_reset_token")
        if (resetToken) {
            return { type: "password-reset", param: param.passwordReset(packResetToken(resetToken)) }
        }

        // 特に指定が無ければパスワードログイン
        return { type: "password-login" }
    }

    currentPagePathname(): PagePathname {
        return packPagePathname(new URL(this.currentLocation.toString()))
    }
}
