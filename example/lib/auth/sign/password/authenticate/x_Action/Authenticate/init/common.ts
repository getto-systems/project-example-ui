import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"
import {
    getSecureScriptPath,
    newGetSecureScriptPathLocationInfo,
} from "../../../../../common/secureScriptPath/get/impl"
import { startContinuousRenewAuthnInfo } from "../../../../../kernel/authnInfo/common/startContinuousRenew/impl"
import { authenticatePassword } from "../../../impl"

import {
    AuthenticatePasswordEntryPoint,
    AuthenticatePasswordAction,
    AuthenticatePasswordBackground,
    AuthenticatePasswordForeground,
} from "../action"
import { AuthenticatePasswordCoreAction } from "../Core/action"
import { AuthenticatePasswordFormAction } from "../Form/action"
import { newBackgroundBase } from "./worker/background"
import { newForegroundBase } from "./worker/foreground"

export function toAuthenticatePasswordEntryPoint(
    action: AuthenticatePasswordAction,
): AuthenticatePasswordEntryPoint {
    return {
        // TODO newAuthSignLinkResource ではなく、 href: newSignHrefMaterial にしたい
        resource: { authenticate: action, ...newAuthSignLinkResource() },
        terminate: () => action.terminate(),
    }
}

export function toAuthenticatePasswordAction(
    actions: Readonly<{
        core: AuthenticatePasswordCoreAction
        form: AuthenticatePasswordFormAction
    }>,
): AuthenticatePasswordAction {
    return {
        ...actions,
        terminate: () => {
            actions.core.terminate()
            actions.form.terminate()
        },
    }
}

export function newForegroundMaterial(
    webStorage: Storage,
    currentURL: URL,
): AuthenticatePasswordForeground {
    const base = newForegroundBase(webStorage)
    const locationInfo = newGetSecureScriptPathLocationInfo(currentURL)
    return {
        core: {
            startContinuousRenew: startContinuousRenewAuthnInfo(base.startContinuousRenew),
            getSecureScriptPath: getSecureScriptPath(base.getSecureScriptPath)(locationInfo),
        },
    }
}

export function newBackgroundMaterial(): AuthenticatePasswordBackground {
    const base = newBackgroundBase()
    return {
        core: {
            authenticate: authenticatePassword(base.authenticate),
        },
    }
}
