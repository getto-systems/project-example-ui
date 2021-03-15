import { newCheckAuthTicketView } from "../../sign/auth_ticket/action_check/init"
import { newRequestResetTokenView } from "../../sign/password/reset/action_request_token/init/foreground"
import { newResetPasswordView } from "../../sign/password/reset/action_reset/init/foreground"
import { newCheckPasswordResetSendingStatus } from "../../sign/password/reset/action_check_status/init/foreground"
import { newAuthenticatePasswordView } from "../../sign/password/action_authenticate/init/foreground"
import { newSignViewLocationDetecter } from "../../sign/common/switch_view/init"

import { initSignView } from "../impl"
import { initSignAction } from "../core/impl"

import { SignView } from "../resource"
import { initSignLinkResource } from "../../sign/common/nav/action_nav/impl"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newSignForeground(feature: OutsideFeature): SignView {
    const { currentLocation } = feature
    return initSignView(
        initSignAction(newSignViewLocationDetecter(currentLocation), {
            link: () => initSignLinkResource(),

            check: () => newCheckAuthTicketView(feature),

            password_authenticate: () => newAuthenticatePasswordView(feature),

            password_reset_requestToken: () => newRequestResetTokenView(),
            password_reset_checkStatus: () => newCheckPasswordResetSendingStatus(feature),
            password_reset: () => newResetPasswordView(feature),
        }),
    )
}
