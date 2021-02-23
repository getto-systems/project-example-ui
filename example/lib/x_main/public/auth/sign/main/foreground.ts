import { newAuthenticatePassword } from "../../../../../auth/sign/password/authenticate/x_Action/Authenticate/init/foreground"
import { newRenewAuthnInfo } from "../../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/main"

import { initLoginViewLocationInfo, toAuthSignEntryPoint, View } from "../impl"

import { AuthSignEntryPoint } from "../entryPoint"
import { newRequestPasswordResetToken } from "../../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/init/foreground"
import { newResetPassword } from "../../../../../auth/sign/password/reset/reset/x_Action/Reset/main/core"
import { newCheckPasswordResetSendingStatus } from "../../../../../auth/sign/password/reset/checkStatus/x_Action/CheckStatus/main/core"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentURL: URL
}>
export function newForeground(feature: OutsideFeature): AuthSignEntryPoint {
    const { webStorage, currentURL } = feature
    return toAuthSignEntryPoint(
        new View(initLoginViewLocationInfo(currentURL), {
            renew: () => newRenewAuthnInfo(webStorage, currentURL),

            password_authenticate: () => newAuthenticatePassword(webStorage, currentURL),

            password_reset_requestToken: () => newRequestPasswordResetToken(),
            password_reset_checkStatus: () => newCheckPasswordResetSendingStatus(currentURL),
            password_reset: () => newResetPassword(webStorage, currentURL),
        }),
    )
}
