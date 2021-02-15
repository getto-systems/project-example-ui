import { LinkComponent } from "./component"

import { AuthLocationSearchParams } from "../../../../sign/authLocation/data"

export function initLinkComponent(): LinkComponent {
    return {
        passwordLogin,
        passwordResetSession,
    }
}

function passwordLogin(): string {
    return `?${AuthLocationSearchParams.passwordLogin}`
}
function passwordResetSession(): string {
    return `?${AuthLocationSearchParams.passwordReset}=${AuthLocationSearchParams.passwordReset_start}`
}
