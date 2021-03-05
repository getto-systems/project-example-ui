import { newAuthenticatePasswordEntryPoint } from "../../../password/authenticate/Action/init/foreground"
import { newCheckAuthInfoEntryPoint } from "../../../kernel/authInfo/check/Action/init"

import { toSignEntryPoint } from "../impl"

import { SignEntryPoint } from "../entryPoint"
import { newRequestResetTokenEntryPoint } from "../../../password/reset/requestToken/Action/init/foreground"
import { newResetPassword } from "../../../password/reset/reset/x_Action/Reset/init/foreground"
import { newCheckPasswordResetSendingStatus } from "../../../password/reset/checkStatus/Action/init/foreground"
import { newSignViewLocationDetecter } from "../../impl/init"
import { initSignAction } from "../Core/impl"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newSignForeground(feature: OutsideFeature): SignEntryPoint {
    const { webStorage, currentLocation } = feature
    return toSignEntryPoint(
        initSignAction(newSignViewLocationDetecter(currentLocation), {
            renew: () => newCheckAuthInfoEntryPoint(webStorage, currentLocation),

            password_authenticate: () => newAuthenticatePasswordEntryPoint(webStorage, currentLocation),

            password_reset_requestToken: () => newRequestResetTokenEntryPoint(),
            password_reset_checkStatus: () => newCheckPasswordResetSendingStatus(currentLocation),
            password_reset: () => newResetPassword(webStorage, currentLocation),
        }),
    )
}
