import { h, VNode } from "preact"
import { useEffect, useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useComponent, useTermination } from "../../common/hooks"

import { ApplicationError } from "../../common/System/ApplicationError"

import { RenewCredential } from "./RenewCredential"

import { PasswordLogin } from "./PasswordLogin"
import { PasswordResetSession } from "./PasswordResetSession"
import { PasswordReset } from "./PasswordReset"

import {
    LoginEntryPoint,
    initialLoginState,
} from "../../../auth/z_EntryPoint/Sign/entryPoint"

export function EntryPoint({ view, terminate }: LoginEntryPoint): VNode {
    useTermination(terminate)

    const [err] = useErrorBoundary((err) => {
        // 認証前なのでエラーはどうしようもない
        console.log(err)
    })
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    const state = useComponent(view, initialLoginState)
    useEffect(() => {
        view.load()
    }, [])

    switch (state.type) {
        case "initial-view":
            return EMPTY_CONTENT

        case "renew-credential":
            return h(RenewCredential, state.entryPoint)

        case "password-login":
            return h(PasswordLogin, state.entryPoint)

        case "password-reset-session":
            return h(PasswordResetSession, state.entryPoint)

        case "password-reset":
            return h(PasswordReset, state.entryPoint)

        case "error":
            return h(ApplicationError, { err: state.err })
    }
}

const EMPTY_CONTENT = html``
