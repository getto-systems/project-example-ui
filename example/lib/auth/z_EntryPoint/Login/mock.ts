import { MockComponent, MockPropsPasser } from "../../../sub/getto-example/x_components/Application/mock"

import {
    initMockRenewCredentialResource,
    RenewCredentialResourceMockPropsPasser,
} from "../../x_Resource/Login/RenewCredential/mock"
import {
    initMockPasswordLoginResource,
    PasswordLoginResourceMockPropsPasser,
} from "../../x_Resource/Login/PasswordLogin/mock"
import {
    initMockPasswordResetSessionResource,
    PasswordResetSessionResourceMockPropsPasser,
} from "../../x_Resource/Profile/PasswordResetSession/mock"
import {
    initMockPasswordResetResource,
    PasswordResetResourceMockPropsPasser,
} from "../../x_Resource/Profile/PasswordReset/mock"

import { LoginEntryPoint, LoginView, LoginState } from "./entryPoint"

export function newMockLoginAsRenewCredential(
    passer: RenewCredentialResourceMockPropsPasser
): LoginEntryPoint {
    return {
        view: new MockView({
            type: "renew-credential",
            entryPoint: initEntryPoint(initMockRenewCredentialResource(passer)),
        }),
        terminate,
    }
}

export function newMockLoginAsPasswordLogin(
    passer: PasswordLoginResourceMockPropsPasser
): LoginEntryPoint {
    return {
        view: new MockView({
            type: "password-login",
            entryPoint: initEntryPoint(initMockPasswordLoginResource(passer)),
        }),
        terminate,
    }
}

export function newMockLoginAsPasswordResetSession(
    passer: PasswordResetSessionResourceMockPropsPasser
): LoginEntryPoint {
    return {
        view: new MockView({
            type: "password-reset-session",
            entryPoint: initEntryPoint(initMockPasswordResetSessionResource(passer)),
        }),
        terminate,
    }
}

export function newMockLoginAsPasswordReset(
    passer: PasswordResetResourceMockPropsPasser
): LoginEntryPoint {
    return {
        view: new MockView({
            type: "password-reset",
            entryPoint: initEntryPoint(initMockPasswordResetResource(passer)),
        }),
        terminate,
    }
}

type EntryPoint<R> = Readonly<{
    resource: R
    terminate: Terminate
}>
interface Terminate {
    (): void
}

function initEntryPoint<R>(resource: R): EntryPoint<R> {
    return {
        resource,
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
