import { MockComponent } from "../../../sub/getto-example/application/mock"

import { initMockRenewCredential } from "../renewCredential/mock"
import { initMockPasswordLoginForm, initMockPasswordLogin } from "../passwordLogin/mock"
import { initMockPasswordResetSession } from "../passwordResetSession/mock"
import { initMockPasswordReset } from "../passwordReset/mock"
import { initMockLoginIDField } from "../field/loginID/mock"
import { initMockPasswordField } from "../field/password/mock"

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
    FormState,
    initialFormState,
} from "../../../sub/getto-form/component/component"

export function newMockLoginAsRenewCredential(): {
    login: LoginEntryPoint
    update: { renewCredential: Post<RenewCredentialState> }
} {
    const mock = {
        renewCredential: new MockResource(initialRenewCredentialState, initMockRenewCredential),
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

export function newMockLoginAsPasswordLogin(): {
    login: LoginEntryPoint
    update: {
        passwordLogin: Post<PasswordLoginState>
        form: Post<FormState>
        loginIDField: Post<LoginIDFieldState>
        passwordField: Post<PasswordFieldState>
    }
} {
    const mock = {
        passwordLogin: new MockResource(initialPasswordLoginState, initMockPasswordLogin),
        form: new MockResource(initialFormState, initMockPasswordLoginForm),
        loginIDField: new MockResource(initialLoginIDFieldState, initMockLoginIDField),
        passwordField: new MockResource(initialPasswordFieldState, initMockPasswordField),
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

export function newMockLoginAsPasswordResetSession(): {
    login: LoginEntryPoint
    update: {
        passwordResetSession: Post<PasswordResetSessionState>
        loginIDField: Post<LoginIDFieldState>
    }
} {
    const mock = {
        passwordResetSession: new MockResource(
            initialPasswordResetSessionState,
            initMockPasswordResetSession
        ),
        loginIDField: new MockResource(initialLoginIDFieldState, initMockLoginIDField),
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

export function newMockLoginAsPasswordReset(): {
    login: LoginEntryPoint
    update: {
        passwordReset: Post<PasswordResetState>
        loginIDField: Post<LoginIDFieldState>
        passwordField: Post<PasswordFieldState>
    }
} {
    const mock = {
        passwordReset: new MockResource(initialPasswordResetState, initMockPasswordReset),
        loginIDField: new MockResource(initialLoginIDFieldState, initMockLoginIDField),
        passwordField: new MockResource(initialPasswordFieldState, initMockPasswordField),
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

export function newMockLoginAsError(): {
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
