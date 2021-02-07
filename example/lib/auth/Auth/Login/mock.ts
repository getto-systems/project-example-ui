import { MockComponent } from "../../../sub/getto-example/application/mock"

import { initRenewCredential } from "../renewCredential/mock"
import { initMockPasswordLoginForm, initPasswordLogin } from "../passwordLogin/mock"
import { initPasswordResetSession } from "../passwordResetSession/mock"
import { initPasswordReset } from "../passwordReset/mock"
import { initLoginIDField } from "../field/loginID/mock"
import { initPasswordField } from "../field/password/mock"

import { LoginEntryPoint, LoginView, LoginState } from "./entryPoint"
import { initialRenewCredentialState, RenewCredentialState } from "../renewCredential/component"
import { initialPasswordLoginState, PasswordLoginState } from "../passwordLogin/component"
import { initialLoginIDFieldState, LoginIDFieldState } from "../field/loginID/component"
import { initialPasswordFieldState, PasswordFieldState } from "../field/password/component"
import {
    initialPasswordResetSessionState,
    PasswordResetSessionState,
} from "../passwordResetSession/component"
import { initialPasswordResetState, PasswordResetState } from "../passwordReset/component"
import {
    FormComponentState,
    initialFormComponentState,
} from "../../../sub/getto-form/component/component"

export function newLoginAsRenewCredential(): {
    login: LoginEntryPoint
    update: { renewCredential: Post<RenewCredentialState> }
} {
    const mock = {
        renewCredential: new MockResource(initialRenewCredentialState, initRenewCredential),
    }
    return {
        login: {
            view: new View({
                type: "renew-credential",
                resource: {
                    renewCredential: mock.renewCredential.init(),
                },
            }),
            terminate: () => {
                // mock では特に何もしない
            },
        },
        update: {
            renewCredential: mock.renewCredential.update(),
        },
    }
}

export function newLoginAsPasswordLogin(): {
    login: LoginEntryPoint
    update: {
        passwordLogin: Post<PasswordLoginState>
        form: Post<FormComponentState>
        loginIDField: Post<LoginIDFieldState>
        passwordField: Post<PasswordFieldState>
    }
} {
    const mock = {
        passwordLogin: new MockResource(initialPasswordLoginState, initPasswordLogin),
        form: new MockResource(initialFormComponentState, initMockPasswordLoginForm),
        loginIDField: new MockResource(initialLoginIDFieldState, initLoginIDField),
        passwordField: new MockResource(initialPasswordFieldState, initPasswordField),
    }
    return {
        login: {
            view: new View({
                type: "password-login",
                resource: {
                    passwordLogin: mock.passwordLogin.init(),
                    form: mock.form.init(),
                },
            }),
            terminate: () => {
                // mock では特に何もしない
            },
        },
        update: {
            passwordLogin: mock.passwordLogin.update(),
            form: mock.form.update(),
            loginIDField: mock.loginIDField.update(),
            passwordField: mock.passwordField.update(),
        },
    }
}

export function newLoginAsPasswordResetSession(): {
    login: LoginEntryPoint
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
        login: {
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
        },
        update: {
            passwordResetSession: mock.passwordResetSession.update(),
            loginIDField: mock.loginIDField.update(),
        },
    }
}

export function newLoginAsPasswordReset(): {
    login: LoginEntryPoint
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
        login: {
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
        },
        update: {
            passwordReset: mock.passwordReset.update(),
            loginIDField: mock.loginIDField.update(),
            passwordField: mock.passwordField.update(),
        },
    }
}

export function newLoginAsError(): {
    login: LoginEntryPoint
    update: { error: Post<string> }
} {
    const mock = new MockResource(map("error"), (state) => new View(state))
    return {
        login: {
            view: mock.init(),
            terminate: () => {
                // mock では特に何もしない
            },
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
