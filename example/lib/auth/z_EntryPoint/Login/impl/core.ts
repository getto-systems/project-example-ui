import { ApplicationBaseComponent } from "../../../../sub/getto-example/Application/impl"

import {
    LoginView,
    LoginState,
    ViewState,
    PasswordLoginEntryPoint,
    PasswordResetSessionEntryPoint,
    PasswordResetEntryPoint,
} from "../entryPoint"

import { RenewCredentialResource } from "../../../x_Resource/Login/RenewCredential/resource"
import { PasswordLoginResource } from "../../../x_Resource/Login/PasswordLogin/resource"
import { PasswordResetSessionResource } from "../../../x_Resource/Profile/PasswordResetSession/resource"
import { PasswordResetResource } from "../../../x_Resource/Profile/PasswordReset/resource"

import { RenewComponent } from "../../../x_Resource/Login/RenewCredential/Renew/component"
import { LoginLinkResource } from "../../../x_Resource/common/LoginLink/resource"

export class View extends ApplicationBaseComponent<LoginState> implements LoginView {
    locationInfo: LoginViewLocationInfo
    components: LoginResourceFactory

    constructor(locationInfo: LoginViewLocationInfo, components: LoginResourceFactory) {
        super()
        this.locationInfo = locationInfo
        this.components = components
    }

    load(): void {
        // TODO hook 使わなくていいな
        const resource = this.components.renewCredential((renewCredential) => {
            this.hookCredentialStateChange(renewCredential)
        })

        this.post({
            type: "renew-credential",
            entryPoint: {
                resource,
                terminate: () => {
                    resource.renew.terminate()
                },
            },
        })
    }
    error(err: string): void {
        this.post({ type: "error", err })
    }

    hookCredentialStateChange(renewCredential: RenewComponent): void {
        renewCredential.addStateHandler((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.post(this.mapLoginView(this.locationInfo.login.getLoginView()))
                    return
            }
        })
    }
    mapLoginView(loginView: ViewState): LoginState {
        switch (loginView) {
            case "password-login":
                return { type: loginView, entryPoint: this.passwordLogin() }
            case "password-reset-session":
                return { type: loginView, entryPoint: this.passwordResetSession() }
            case "password-reset":
                return { type: loginView, entryPoint: this.passwordReset() }
        }
    }

    passwordLogin(): PasswordLoginEntryPoint {
        const resource = { ...this.components.passwordLogin(), ...this.components.loginLink() }
        return {
            resource,
            terminate: () => {
                resource.login.terminate()
                resource.form.terminate()
            },
        }
    }
    passwordResetSession(): PasswordResetSessionEntryPoint {
        const resource = { ...this.components.passwordResetSession(), ...this.components.loginLink() }
        return {
            resource,
            terminate: () => {
                resource.session.terminate()
                resource.form.terminate()
            },
        }
    }
    passwordReset(): PasswordResetEntryPoint {
        const resource = { ...this.components.passwordReset(), ...this.components.loginLink() }
        return {
            resource,
            terminate: () => {
                resource.reset.terminate()
                resource.form.terminate()
            },
        }
    }
}

export interface LoginResourceFactory {
    loginLink(): LoginLinkResource

    renewCredential(setup: Setup<RenewComponent>): RenewCredentialResource

    passwordLogin(): PasswordLoginResource
    passwordResetSession(): PasswordResetSessionResource
    passwordReset(): PasswordResetResource
}
export interface LoginViewLocationInfo {
    login: Readonly<{
        getLoginView(): ViewState
    }>
}

interface Setup<T> {
    (component: T): void
}
