import { initFormAction } from "../../../../../sub/getto-form/main/form"
import { initRenewAction, initSetContinuousRenewAction } from "./action/renew"
import { initApplicationAction } from "./action/application"
import { initLoginIDFormFieldAction, initPasswordFormFieldAction } from "./action/form"
import { initPasswordLoginAction } from "./action/login"
import { initPasswordResetAction, initPasswordResetSessionAction } from "./action/reset"

import { LoginViewLocationInfo, View } from "../impl/core"
import {
    initRenewCredentialResource,
    RenewCredentialLocationInfo,
    RenewCredentialFactory,
} from "../impl/renew"
import {
    initPasswordLoginResource,
    PasswordLoginLocationInfo,
    PasswordLoginFactory,
} from "../impl/login"
import {
    initPasswordResetResource,
    initPasswordResetSessionResource,
    PasswordResetLocationInfo,
    PasswordResetFactory,
    PasswordResetSessionFactory,
} from "../impl/reset"

import { initLoginLink } from "./link"

import { initRenewCredentialComponent } from "../../renewCredential/impl"
import { initPasswordLoginComponent, initPasswordLoginFormComponent } from "../../passwordLogin/impl"
import {
    initPasswordResetSessionComponent,
    initPasswordResetSessionFormComponent,
} from "../../passwordResetSession/impl"
import { initPasswordResetComponent, initPasswordResetFormComponent } from "../../passwordReset/impl"

import { currentPagePathname, detectViewState, detectResetToken } from "../impl/location"

import { LoginEntryPoint } from "../entryPoint"

export function newLoginAsSingle(): LoginEntryPoint {
    const credentialStorage = localStorage
    const currentURL = new URL(location.toString())

    const factory: Factory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(),
            renew: initRenewAction(credentialStorage),
            setContinuousRenew: initSetContinuousRenewAction(credentialStorage),

            passwordLogin: initPasswordLoginAction(),
            passwordResetSession: initPasswordResetSessionAction(),
            passwordReset: initPasswordResetAction(),

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
                password: initPasswordFormFieldAction(),
            },
        },
        components: {
            renewCredential: initRenewCredentialComponent,

            passwordLogin: { core: initPasswordLoginComponent, form: initPasswordLoginFormComponent },
            passwordResetSession: {
                core: initPasswordResetSessionComponent,
                form: initPasswordResetSessionFormComponent,
            },
            passwordReset: { core: initPasswordResetComponent, form: initPasswordResetFormComponent },
        },
    }
    const locationInfo: LocationInfo = {
        login: {
            getLoginView: () => detectViewState(currentURL),
        },
        application: {
            getPagePathname: () => currentPagePathname(currentURL),
        },
        passwordReset: {
            getResetToken: () => detectResetToken(currentURL),
        },
    }

    const view = new View(locationInfo, {
        renewCredential: (setup) => initRenewCredentialResource(factory, locationInfo, setup),

        passwordLogin: () => initPasswordLoginResource(factory, locationInfo),
        passwordResetSession: () => initPasswordResetSessionResource(factory),
        passwordReset: () => initPasswordResetResource(factory, locationInfo),
    })
    return {
        view,
        terminate: () => {
            view.terminate()
        },
    }
}

type Factory = RenewCredentialFactory &
    PasswordLoginFactory &
    PasswordResetSessionFactory &
    PasswordResetFactory

type LocationInfo = LoginViewLocationInfo &
    RenewCredentialLocationInfo &
    PasswordLoginLocationInfo &
    PasswordResetLocationInfo
