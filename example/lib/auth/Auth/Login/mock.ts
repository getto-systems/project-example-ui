import { MockComponent } from "../../../z_external/mock/component"

import { initRenewCredential } from "../renew_credential/mock"
import { initPasswordLogin } from "../password_login/mock"
import { initPasswordResetSession } from "../password_reset_session/mock"
import { initPasswordReset } from "../password_reset/mock"
import { initLoginIDField } from "../field/login_id/mock"
import { initPasswordField } from "../field/password/mock"

import { LoginEntryPointFactory, LoginView, LoginState } from "./view"
import { initialRenewCredentialState, RenewCredentialState } from "../renew_credential/component"
import { initialPasswordLoginState, PasswordLoginState } from "../password_login/component"
import { initialLoginIDFieldState, LoginIDFieldState } from "../field/login_id/component"
import { initialPasswordFieldState, PasswordFieldState } from "../field/password/component"
import {
    initialPasswordResetSessionState,
    PasswordResetSessionState,
} from "../password_reset_session/component"
import { initialPasswordResetState, PasswordResetState } from "../password_reset/component"

export function newLoginAsRenewCredential(): {
    login: LoginEntryPointFactory
    update: { renewCredential: Post<RenewCredentialState> }
} {
    const mock = {
        renewCredential: new MockResource(initialRenewCredentialState, initRenewCredential),
    }
    return {
        login: () => {
            return {
                view: new View({
                    type: "renew-credential",
                    resource: {
                        renewCredential: mock.renewCredential.init(),
                    },
                }),
                terminate: () => {
                    // mock では特に何もしない
                },
            }
        },
        update: {
            renewCredential: mock.renewCredential.update(),
        },
    }
}

export function newLoginAsPasswordLogin(): {
    login: LoginEntryPointFactory
    update: {
        passwordLogin: Post<PasswordLoginState>
        loginIDField: Post<LoginIDFieldState>
        passwordField: Post<PasswordFieldState>
    }
} {
    const mock = {
        passwordLogin: new MockResource(initialPasswordLoginState, initPasswordLogin),
        loginIDField: new MockResource(initialLoginIDFieldState, initLoginIDField),
        passwordField: new MockResource(initialPasswordFieldState, initPasswordField),
    }
    return {
        login: () => {
            return {
                view: new View({
                    type: "password-login",
                    resource: {
                        passwordLogin: mock.passwordLogin.init(),
                        loginIDField: mock.loginIDField.init(),
                        passwordField: mock.passwordField.init(),
                    },
                }),
                terminate: () => {
                    // mock では特に何もしない
                },
            }
        },
        update: {
            passwordLogin: mock.passwordLogin.update(),
            loginIDField: mock.loginIDField.update(),
            passwordField: mock.passwordField.update(),
        },
    }
}

export function newLoginAsPasswordResetSession(): {
    login: LoginEntryPointFactory
    update: {
        passwordResetSession: Post<PasswordResetSessionState>
        loginIDField: Post<LoginIDFieldState>
    }
} {
    const mock = {
        passwordResetSession: new MockResource(
            initialPasswordResetSessionState,
            initPasswordResetSession
        ),
        loginIDField: new MockResource(initialLoginIDFieldState, initLoginIDField),
    }
    return {
        login: () => {
            return {
                view: new View({
                    type: "password-reset-session",
                    resource: {
                        passwordResetSession: mock.passwordResetSession.init(),
                        loginIDField: mock.loginIDField.init(),
                    },
                }),
                terminate: () => {
                    // mock では特に何もしない
                },
            }
        },
        update: {
            passwordResetSession: mock.passwordResetSession.update(),
            loginIDField: mock.loginIDField.update(),
        },
    }
}

export function newLoginAsPasswordReset(): {
    login: LoginEntryPointFactory
    update: {
        passwordReset: Post<PasswordResetState>
        loginIDField: Post<LoginIDFieldState>
        passwordField: Post<PasswordFieldState>
    }
} {
    const mock = {
        passwordReset: new MockResource(initialPasswordResetState, initPasswordReset),
        loginIDField: new MockResource(initialLoginIDFieldState, initLoginIDField),
        passwordField: new MockResource(initialPasswordFieldState, initPasswordField),
    }
    return {
        login: () => {
            return {
                view: new View({
                    type: "password-reset",
                    resource: {
                        passwordReset: mock.passwordReset.init(),
                        loginIDField: mock.loginIDField.init(),
                        passwordField: mock.passwordField.init(),
                    },
                }),
                terminate: () => {
                    // mock では特に何もしない
                },
            }
        },
        update: {
            passwordReset: mock.passwordReset.update(),
            loginIDField: mock.loginIDField.update(),
            passwordField: mock.passwordField.update(),
        },
    }
}

export function newLoginAsError(): {
    login: LoginEntryPointFactory
    update: { error: Post<string> }
} {
    const mock = new MockResource(map("error"), (state) => new View(state))
    return {
        login: () => {
            return {
                view: mock.init(),
                terminate: () => {
                    // mock では特に何もしない
                },
            }
        },
        update: {
            error: (err) => {
                mock.update()(map(err))
            },
        },
    }

    function map(err: string): LoginState {
        return { type: "error", err }
    }
}

class MockResource<S, C extends MockComponent<S>> {
    state: S
    factory: MockFactory<S, C>

    component: C | null = null

    constructor(state: S, factory: MockFactory<S, C>) {
        this.state = state
        this.factory = factory
    }

    init(): C {
        if (!this.component) {
            this.component = this.factory(this.state)
        }
        return this.component
    }
    update(): Post<S> {
        return (state) => {
            if (!this.component) {
                this.state = state
            } else {
                this.component.update(state)
            }
        }
    }
}
interface MockFactory<S, C extends MockComponent<S>> {
    (state: S): C
}

class View extends MockComponent<LoginState> implements LoginView {
    load(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
