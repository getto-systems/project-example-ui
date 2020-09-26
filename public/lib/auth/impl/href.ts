import { AuthHref } from "../../auth/href"

export function initAuthHref(): AuthHref {
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
