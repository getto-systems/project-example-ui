import { LoginSearch } from "../impl/location"

import { LoginLink } from "../../link"

export function initLoginLink(): LoginLink {
    return {
        passwordLogin,
        passwordResetSession,
    }
}

function passwordLogin(): string {
    return `?${LoginSearch.passwordLogin}`
}
function passwordResetSession(): string {
    return `?${LoginSearch.passwordReset}=${LoginSearch.passwordReset_start}`
}
