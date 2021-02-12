import { LinkComponent } from "./component"

import { AuthSearchParams } from "../../../../common/searchParams/data"

export function initLinkComponent(): LinkComponent {
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
