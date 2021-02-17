import { newRenewAuthInfoResource } from "../../../x_Resource/Sign/AuthInfo/Renew/main"
import { newPasswordAuthenticateResource } from "../../../x_Resource/Sign/Password/Authenticate/main/core"
import { newRegisterPasswordResource } from "../../../x_Resource/Sign/Password/ResetSession/Register/main/core"

import { initLoginViewLocationInfo, View } from "../impl"

import { initAuthSignLinkResource } from "../../../x_Resource/Sign/Link/impl"

import { AuthSignEntryPoint } from "../entryPoint"
import { newStartPasswordResetSessionResource } from "../../../x_Resource/Sign/Password/ResetSession/Start/main/core"
import { currentURL } from "../../../../z_infra/location/url"

export function newLoginAsSingle(): AuthSignEntryPoint {
    const webStorage = localStorage

    const view = new View(initLoginViewLocationInfo(currentURL()), {
        link: initAuthSignLinkResource,

        renew: () => newRenewAuthInfoResource(webStorage),

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
