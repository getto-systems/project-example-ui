import { newAuthenticatePassword } from "../../../../../auth/sign/password/authenticate/x_Action/Authenticate/init/foreground"
import { newRenewAuthnInfo } from "../../../../../auth/sign/kernel/authInfo/check/Action/init"

import { toAuthSignEntryPoint, View } from "../impl"

import { AuthSignEntryPoint } from "../entryPoint"
import { newRequestPasswordResetToken } from "../../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/init/foreground"
import { newResetPassword } from "../../../../../auth/sign/password/reset/reset/x_Action/Reset/init/foreground"
import { newCheckPasswordResetSendingStatus } from "../../../../../auth/sign/password/reset/checkStatus/x_Action/CheckStatus/init/foreground"
import { newAuthSignViewLocationDetecter } from "../init"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newForeground(feature: OutsideFeature): AuthSignEntryPoint {
    const { webStorage, currentLocation } = feature
    return toAuthSignEntryPoint(
        new View(newAuthSignViewLocationDetecter(currentLocation), {
            renew: () => newRenewAuthnInfo(webStorage, currentLocation),

            password_authenticate: () => newAuthenticatePassword(webStorage, currentLocation),

            password_reset_requestToken: () => newRequestPasswordResetToken(),
            password_reset_checkStatus: () => newCheckPasswordResetSendingStatus(currentLocation),
            password_reset: () => newResetPassword(webStorage, currentLocation),
        }),
    )
}
