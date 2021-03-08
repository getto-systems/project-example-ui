import { newAuthenticatePasswordEntryPoint } from "../../sign/password/view_authenticate/init/foreground"
import { newCheckAuthInfoEntryPoint } from "../../sign/kernel/auth_info/action_check/init"

import { toSignEntryPoint } from "../impl"

import { SignEntryPoint } from "../entry_point"
import { newRequestResetTokenEntryPoint } from "../../sign/password/reset/view_request_token/init/foreground"
import { newResetPassword } from "../../sign/password/reset/view_reset/init/foreground"
import { newCheckPasswordResetSendingStatus } from "../../sign/password/reset/view_check_status/init/foreground"
import { newSignViewLocationDetecter } from "../../sign/view/impl/init"
import { initSignAction } from "../core/impl"

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
