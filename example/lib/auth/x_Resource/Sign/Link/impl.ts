import { AuthSignLinkResource } from "./resource"

import { AuthLocationSearchParams } from "../../../sign/common/secureScriptPath/get/data"

export function initAuthSignLinkResource(): AuthSignLinkResource {
    return {
        href: {
            passwordLogin,
            passwordResetSession,
        },
    }
}

function passwordLogin(): string {
    return `?${AuthLocationSearchParams.passwordLogin}`
}
function passwordResetSession(): string {
    return `?${AuthLocationSearchParams.passwordReset}=${AuthLocationSearchParams.passwordReset_start}`
}
