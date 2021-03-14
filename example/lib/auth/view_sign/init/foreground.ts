import { newCheckAuthTicketEntryPoint } from "../../sign/auth_info/action_check/init"
import { newRequestResetTokenEntryPoint } from "../../sign/password/reset/view_request_token/init/foreground"
import { newResetPasswordEntryPoint } from "../../sign/password/reset/view_reset/init/foreground"
import { newCheckPasswordResetSendingStatus } from "../../sign/password/reset/view_check_status/init/foreground"
import { newAuthenticatePasswordEntryPoint } from "../../sign/password/view_authenticate/init/foreground"
import { newSignViewLocationDetecter } from "../../sign/view/impl/init"

import { initSignEntryPoint } from "../impl"
import { initSignAction } from "../core/impl"

import { SignEntryPoint } from "../entry_point"
import { initSignLinkResource } from "../../sign/common/nav/action_nav/impl"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newSignForeground(feature: OutsideFeature): SignEntryPoint {
    const { currentLocation } = feature
    return initSignEntryPoint(
        initSignAction(newSignViewLocationDetecter(currentLocation), {
            link: () => initSignLinkResource(),

            check: () => newCheckAuthTicketEntryPoint(feature),

            password_authenticate: () => newAuthenticatePasswordEntryPoint(feature),

            password_reset_requestToken: () => newRequestResetTokenEntryPoint(),
            password_reset_checkStatus: () => newCheckPasswordResetSendingStatus(feature),
            password_reset: () => newResetPasswordEntryPoint(feature),
        }),
    )
}
