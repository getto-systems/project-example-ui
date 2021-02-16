import { MockAction, MockPropsPasser } from "../../../common/vendor/getto-example/Application/mock"

import {
    initMockAuthSignRenewResource,
    AuthSignRenewMockPropsPasser,
} from "./resources/Renew/mock"
import {
    initMockAuthSignPasswordAuthenticateResource,
    AuthSignPasswordAuthenticateMockPropsPasser,
} from "./resources/Password/Authenticate/mock"
import {
    initMockPasswordResetSessionResource,
    PasswordResetSessionResourceMockPropsPasser,
} from "../../x_Resource/sign/PasswordResetSession/mock"
import {
    initMockAuthSignPasswordResetSessionRegister,
    AuthSignPasswordResetSessionRegisterMockPropsPasser,
} from "./resources/Password/ResetSession/Register/mock"

import {
    AuthSignEntryPoint,
    AuthSignView,
    AuthSignViewState,
    PasswordLoginEntryPoint,
    RenewCredentialEntryPoint,
    PasswordResetSessionEntryPoint,
    PasswordResetEntryPoint,
} from "./entryPoint"
import { AuthSignLinkResource } from "./resources/Link/resource"
import { initAuthSignLinkResource } from "./resources/Link/impl"

export function initMockRenewCredentialEntryPoint(
    passer: AuthSignRenewMockPropsPasser
): RenewCredentialEntryPoint {
    return initEntryPoint(initMockAuthSignRenewResource(passer))
}

export function initMockPasswordLoginEntryPoint(
    passer: AuthSignPasswordAuthenticateMockPropsPasser
): PasswordLoginEntryPoint {
    return initEntryPoint(initMockAuthSignPasswordAuthenticateResource(passer))
}

export function initMockPasswordResetSessionEntryPoint(
    passer: PasswordResetSessionResourceMockPropsPasser
): PasswordResetSessionEntryPoint {
    return initEntryPoint(initMockPasswordResetSessionResource(passer))
}

export function initMockPasswordResetEntryPoint(
    passer: AuthSignPasswordResetSessionRegisterMockPropsPasser
): PasswordResetEntryPoint {
    return initEntryPoint(initMockAuthSignPasswordResetSessionRegister(passer))
}

type EntryPoint<R> = Readonly<{
    resource: R
    terminate: Terminate
}>
interface Terminate {
    (): void
}

function initEntryPoint<R>(resource: R): EntryPoint<R & AuthSignLinkResource> {
    return {
        resource: { ...resource, ...initAuthSignLinkResource() },
        terminate,
    }
}

export function initMockLoginEntryPointAsError(passer: LoginErrorMockPropsPasser): AuthSignEntryPoint {
    return {
        view: new MockErrorView(passer),
        terminate,
    }
}

export type LoginErrorMockPropsPasser = MockPropsPasser<LoginErrorMockProps>
export type LoginErrorMockProps = Readonly<{ error: string }>

class MockErrorView extends MockAction<AuthSignViewState> implements AuthSignView {
    constructor(passer: LoginErrorMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(err: LoginErrorMockProps): AuthSignViewState {
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
