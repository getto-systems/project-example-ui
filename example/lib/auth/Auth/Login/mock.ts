import { MockComponent, MockPropsPasser } from "../../../sub/getto-example/application/mock"

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
        view: new MockView({
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
        view: new MockView({
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
        view: new MockView({
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
        view: new MockView({
            type: "password-reset",
            resource: {
                passwordReset: initMockPasswordReset(passer),
                form: initMockPasswordResetForm(passer),
            },
        }),
        terminate,
    }
}

export function newMockLoginAsError(passer: LoginErrorMockPropsPasser): LoginEntryPoint {
    return {
        view: new MockErrorView(passer),
        terminate,
    }
}

class MockView extends MockComponent<LoginState> implements LoginView {
    constructor(state: LoginState) {
        super()
        this.post(state)
    }

    load(): void {
        // mock では特に何もしない
    }
}

export type LoginErrorMockPropsPasser = MockPropsPasser<LoginErrorMockProps>
export type LoginErrorMockProps = Readonly<{ error: string }>

class MockErrorView extends MockComponent<LoginState> implements LoginView {
    constructor(passer: LoginErrorMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(err: LoginErrorMockProps): LoginState {
            return { type: "error", err: err.error }
        }
    }

    load(): void {
        // mock では特に何もしない
    }
}

function terminate() {
    // mock では特に何もしない
}
