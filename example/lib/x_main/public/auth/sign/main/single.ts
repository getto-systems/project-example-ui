import { newAuthenticatePassword } from "../../../../../auth/sign/password/authenticate/x_Action/Authenticate/main/core"
import { newRenewAuthnInfo } from "../../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/main"

import { initLoginViewLocationInfo, View } from "../impl"

import { newAuthSignLinkResource } from "../../../../../auth/sign/common/searchParams/x_Action/Link/impl"

import { AuthSignEntryPoint } from "../entryPoint"
import { newStartPasswordResetSession } from "../../../../../auth/sign/password/resetSession/start/x_Action/Start/main/core"
import { currentURL } from "../../../../../z_getto/infra/location/url"
import { newRegisterPassword } from "../../../../../auth/sign/password/resetSession/register/x_Action/Register/main/core"

export function newLoginAsSingle(): AuthSignEntryPoint {
    const webStorage = localStorage

    const view = new View(initLoginViewLocationInfo(currentURL()), {
        link: newAuthSignLinkResource,

        renew: () => newRenewAuthnInfo(webStorage),

        passwordLogin: () => newAuthenticatePassword(webStorage),
        passwordResetSession: () => newStartPasswordResetSession(),
        passwordReset: () => newRegisterPassword(webStorage),
    })
    return {
        view,
        terminate: () => {
            view.terminate()
        },
    }
}
