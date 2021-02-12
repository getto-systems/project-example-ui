import { LoginLink } from "../link"

import { AuthSearchParams } from "../../../common/searchParams/data"

export function initLoginLink(): LoginLink {
    return {
        passwordLogin,
        passwordResetSession,
    }
}

function passwordLogin(): string {
    return `?${AuthSearchParams.passwordLogin}`
}
function passwordResetSession(): string {
    return `?${AuthSearchParams.passwordReset}=${AuthSearchParams.passwordReset_start}`
}
