import { AuthSignLinkResource } from "./action"

import { AuthSignSearchParams } from "../../data"

export function initAuthSignLinkResource(): AuthSignLinkResource {
    return {
        href: {
            passwordLogin,
            passwordResetSession,
        },
    }
}

function passwordLogin(): string {
    return `?${AuthSignSearchParams.passwordLogin}`
}
function passwordResetSession(): string {
    return `?${AuthSignSearchParams.passwordReset}=${AuthSignSearchParams.passwordReset_start}`
}
