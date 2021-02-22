import { AuthSignLinkResource } from "./action"

import { authSignSearch_password_login, authSignSearch_password_reset } from "../../data"

export function newAuthSignLinkResource(): AuthSignLinkResource {
    return {
        href: {
            passwordLogin,
            passwordResetSession,
        },
    }
}

function passwordLogin(): string {
    return `?${authSignSearch_password_login()}`
}
function passwordResetSession(): string {
    return `?${authSignSearch_password_reset("start")}`
}
