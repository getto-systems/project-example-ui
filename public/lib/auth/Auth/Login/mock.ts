import { MockComponent } from "../../../z_external/mock/component"

import { initRenewCredential, initRenewCredentialWithState } from "../renew_credential/mock"

import { initPasswordLogin, initPasswordLoginWithState } from "../password_login/mock"
import {
    initPasswordResetSession,
    initPasswordResetSessionWithState,
} from "../password_reset_session/mock"
import { initPasswordReset, initPasswordResetWithState } from "../password_reset/mock"

import { initLoginIDField, LoginIDFieldStateFactory } from "../field/login_id/mock"
import { initPasswordField, PasswordFieldStateFactory } from "../field/password/mock"

import { LoginFactory, LoginView, LoginState } from "./view"
import { initialRenewCredentialState, RenewCredentialState } from "../renew_credential/component"
import { initialPasswordLoginState, PasswordLoginState } from "../password_login/component"
import { initialLoginIDFieldState, LoginIDFieldState } from "../field/login_id/component"
import { initialPasswordFieldState, PasswordFieldState } from "../field/password/component"
import {
    initialPasswordResetSessionState,
    PasswordResetSessionState,
} from "../password_reset_session/component"
import { initialPasswordResetState, PasswordResetState } from "../password_reset/component"

export function newLoginAsMock(): LoginFactory {
    return newLoginWithState(new LoginStateFactory().renewCredential())
}
export function newLoginWithState(state: LoginState): LoginFactory {
    return () => {
        return {
            view: new View(state),
            terminate: () => {
                // mock では特に何もしない
            },
        }
    }
}

export function newLoginAsRenewCredential(): {
    login: LoginFactory
    update: { renewCredential: Post<RenewCredentialState> }
} {
    const mock = {
        renewCredential: new MockResource(initialRenewCredentialState, initRenewCredentialWithState),
    }
    return {
        login: () => {
            return {
                view: new View({
                    type: "renew-credential",
                    components: {
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
    login: LoginFactory
    update: {
        passwordLogin: Post<PasswordLoginState>
        loginIDField: Post<LoginIDFieldState>
        passwordField: Post<PasswordFieldState>
    }
} {
    const mock = {
        passwordLogin: new MockResource(initialPasswordLoginState, initPasswordLoginWithState),
        loginIDField: new MockResource(initialLoginIDFieldState, initLoginIDField),
        passwordField: new MockResource(initialPasswordFieldState, initPasswordField),
    }
    return {
        login: () => {
            return {
                view: new View({
                    type: "password-login",
                    components: {
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
    login: LoginFactory
    update: {
        passwordResetSession: Post<PasswordResetSessionState>
        loginIDField: Post<LoginIDFieldState>
    }
} {
    const mock = {
        passwordResetSession: new MockResource(
            initialPasswordResetSessionState,
            initPasswordResetSessionWithState
        ),
        loginIDField: new MockResource(initialLoginIDFieldState, initLoginIDField),
    }
    return {
        login: () => {
            return {
                view: new View({
                    type: "password-reset-session",
                    components: {
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
    login: LoginFactory
    update: {
        passwordReset: Post<PasswordResetState>
        loginIDField: Post<LoginIDFieldState>
        passwordField: Post<PasswordFieldState>
    }
} {
    const mock = {
        passwordReset: new MockResource(initialPasswordResetState, initPasswordResetWithState),
        loginIDField: new MockResource(initialLoginIDFieldState, initLoginIDField),
        passwordField: new MockResource(initialPasswordFieldState, initPasswordField),
    }
    return {
        login: () => {
            return {
                view: new View({
                    type: "password-reset",
                    components: {
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

export function newLoginAsError(
    err: string
): {
    login: LoginFactory
    update: { error: Post<string> }
} {
    const mock = new MockResource(map(err), (state) => new View(state))
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

class LoginStateFactory {
    renewCredential(): LoginState {
        return {
            type: "renew-credential",
            components: {
                renewCredential: initRenewCredential(),
            },
        }
    }

    passwordLogin(): LoginState {
        return {
            type: "password-login",
            components: {
                passwordLogin: initPasswordLogin(),
                loginIDField: initLoginIDField(new LoginIDFieldStateFactory().empty()),
                passwordField: initPasswordField(new PasswordFieldStateFactory().empty()),
            },
        }
    }
    passwordResetSession(): LoginState {
        return {
            type: "password-reset-session",
            components: {
                passwordResetSession: initPasswordResetSession(),
                loginIDField: initLoginIDField(new LoginIDFieldStateFactory().empty()),
            },
        }
    }
    passwordReset(): LoginState {
        return {
            type: "password-reset",
            components: {
                passwordReset: initPasswordReset(),
                loginIDField: initLoginIDField(new LoginIDFieldStateFactory().empty()),
                passwordField: initPasswordField(new PasswordFieldStateFactory().empty()),
            },
        }
    }

    error(err: string): LoginState {
        return { type: "error", err }
    }
}

class View extends MockComponent<LoginState> implements LoginView {
    load(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
