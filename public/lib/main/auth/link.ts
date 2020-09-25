import { AuthLink } from "../../auth/link"

export function newAuthLink(): AuthLink {
    return {
        passwordLoginHref,
        passwordResetSessionHref,
    }
}

function passwordLoginHref(): string {
    return "?_password_login"
}
function passwordResetSessionHref(): string {
    return "?_password_reset=start"
}