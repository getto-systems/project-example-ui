import { newAuthenticatePasswordEntryPoint } from "../../../password/authenticate/Action/init/foreground"
import { newCheckAuthInfoEntryPoint } from "../../../kernel/authInfo/check/Action/init"

import { toSignEntryPoint } from "../impl"

import { SignEntryPoint } from "../entryPoint"
import { newRequestResetTokenEntryPoint } from "../../../password/reset/requestToken/Action/init/foreground"
import { newResetPassword } from "../../../password/reset/reset/Action/init/foreground"
import { newCheckPasswordResetSendingStatus } from "../../../password/reset/checkStatus/Action/init/foreground"
import { newSignViewLocationDetecter } from "../../impl/init"
import { initSignAction } from "../Core/impl"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newSignForeground(feature: OutsideFeature): SignEntryPoint {
    const { currentLocation } = feature
    return toSignEntryPoint(
        initSignAction(newSignViewLocationDetecter(currentLocation), {
            renew: () => newCheckAuthInfoEntryPoint(feature),

            password_authenticate: () => newAuthenticatePasswordEntryPoint(feature),

            password_reset_requestToken: () => newRequestResetTokenEntryPoint(),
            password_reset_checkStatus: () => newCheckPasswordResetSendingStatus(feature),
            password_reset: () => newResetPassword(feature),
        }),
    )
}
