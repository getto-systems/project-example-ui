import { MockComponent_legacy } from "../../../sub/getto-example/application/mock"

import { initMockRenewCredential, RenewCredentialMockPropsPasser } from "../renewCredential/mock"
import {
    initMockPasswordLoginForm,
    initMockPasswordLogin,
    PasswordLoginMockPropsPasser,
} from "../passwordLogin/mock"
import {
    initMockPasswordResetSession,
    initMockPasswordResetSessionForm,
    PasswordResetSessionMockPropsPasser,
} from "../passwordResetSession/mock"
import {
    initMockPasswordReset,
    initMockPasswordResetForm,
    PasswordResetMockPropsPasser,
} from "../passwordReset/mock"

import { LoginEntryPoint, LoginView, LoginState } from "./entryPoint"

export function newMockLoginAsRenewCredential(passer: RenewCredentialMockPropsPasser): LoginEntryPoint {
    return {
        view: new View({
            type: "renew-credential",
            resource: {
                renewCredential: initMockRenewCredential(passer),
            },
        }),
        terminate,
    }
}

export function newMockLoginAsPasswordLogin(passer: PasswordLoginMockPropsPasser): LoginEntryPoint {
    return {
        view: new View({
            type: "password-login",
            resource: {
                passwordLogin: initMockPasswordLogin(passer),
                form: initMockPasswordLoginForm(passer),
            },
        }),
        terminate,
    }
}

export function newMockLoginAsPasswordResetSession(
    passer: PasswordResetSessionMockPropsPasser
): LoginEntryPoint {
    return {
        view: new View({
            type: "password-reset-session",
            resource: {
                passwordResetSession: initMockPasswordResetSession(passer),
                form: initMockPasswordResetSessionForm(passer),
            },
        }),
        terminate,
    }
}

export function newMockLoginAsPasswordReset(passer: PasswordResetMockPropsPasser): LoginEntryPoint {
    return {
        view: new View({
            type: "password-reset",
            resource: {
                passwordReset: initMockPasswordReset(passer),
                form: initMockPasswordResetForm(passer),
            },
        }),
        terminate,
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
            terminate,
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

class MockResource<S, C extends MockComponent_legacy<S>> {
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
interface MockFactory<S, C extends MockComponent_legacy<S>> {
    (state: S): C
}

class View extends MockComponent_legacy<LoginState> implements LoginView {
    load(): void {
        // mock では特に何もしない
    }
}

function terminate() {
    // mock では特に何もしない
}

interface Post<T> {
    (state: T): void
}
