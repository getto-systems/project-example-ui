import { newAuthenticatePassword } from "../../../../../auth/sign/password/authenticate/x_Action/Authenticate/main/core"
import { newRenewAuthnInfo } from "../../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/main"

import { initLoginViewLocationInfo, toAuthSignEntryPoint, View } from "../impl"

import { newAuthSignLinkResource } from "../../../../../auth/sign/common/searchParams/x_Action/Link/impl"

import { AuthSignEntryPoint } from "../entryPoint"
import { newStartPasswordResetSession } from "../../../../../auth/sign/password/resetSession/start/x_Action/Start/main/core"
import { newRegisterPassword } from "../../../../../auth/sign/password/resetSession/register/x_Action/Register/main/core"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentURL: URL
}>
export function newForeground(feature: OutsideFeature): AuthSignEntryPoint {
    const { webStorage, currentURL } = feature
    return toAuthSignEntryPoint(
        new View(initLoginViewLocationInfo(currentURL), {
            link: newAuthSignLinkResource,

            renew: () => newRenewAuthnInfo(webStorage, currentURL),

            passwordLogin: () => newAuthenticatePassword(webStorage, currentURL),
            passwordResetSession: () => newStartPasswordResetSession(),
            passwordReset: () => newRegisterPassword(webStorage, currentURL),
        }),
    )
}
