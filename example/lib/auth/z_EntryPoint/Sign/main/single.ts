import { newPasswordAuthenticateResource } from "../../../x_Resource/Sign/Password/Authenticate/main/core"
import { newRegisterPasswordResource } from "../../../x_Resource/Sign/Password/ResetSession/Register/main/core"
import { newRenewAuthnInfoAction } from "../../../sign/kernel/authnInfo/renew/x_Action/Renew/main"

import { initLoginViewLocationInfo, View } from "../impl"

import { initAuthSignLinkResource } from "../../../sign/common/searchParams/x_Action/Link/impl"

import { AuthSignEntryPoint } from "../entryPoint"
import { newStartPasswordResetSessionResource } from "../../../x_Resource/Sign/Password/ResetSession/Start/main/core"
import { currentURL } from "../../../../z_infra/location/url"

export function newLoginAsSingle(): AuthSignEntryPoint {
    const webStorage = localStorage

    const view = new View(initLoginViewLocationInfo(currentURL()), {
        link: initAuthSignLinkResource,

        renew: () => ({ renew: newRenewAuthnInfoAction(webStorage) }),

        passwordLogin: () => newPasswordAuthenticateResource(webStorage),
        passwordResetSession: () => newStartPasswordResetSessionResource(),
        passwordReset: () => newRegisterPasswordResource(webStorage),
    })
    return {
        view,
        terminate: () => {
            view.terminate()
        },
    }
}
