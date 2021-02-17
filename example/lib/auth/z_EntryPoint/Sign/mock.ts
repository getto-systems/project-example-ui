import { MockAction, MockPropsPasser } from "../../../common/vendor/getto-example/Application/mock"

import {
    initMockRenewAuthInfoResource,
    RenewAuthInfoMockPropsPasser,
} from "../../x_Resource/Sign/AuthInfo/Renew/mock"
import {
    initMockPasswordAuthenticateResource,
    AuthenticatePasswordResourceMockPropsPasser,
} from "../../x_Resource/Sign/Password/Authenticate/mock"
import {
    initMockStartPasswordResetSessionResource,
    StartPasswordResetSessionResourceMockPropsPasser,
} from "../../x_Resource/Sign/Password/ResetSession/Start/mock"
import {
    initMockRegisterPasswordResource,
    RegisterPasswordResourceMockPropsPasser,
} from "../../x_Resource/Sign/Password/ResetSession/Register/mock"

import {
    AuthSignEntryPoint,
    AuthSignView,
    AuthSignViewState,
    PasswordLoginEntryPoint,
    RenewCredentialEntryPoint,
    PasswordResetSessionEntryPoint,
    PasswordResetEntryPoint,
} from "./entryPoint"
import { AuthSignLinkResource } from "../../x_Resource/Sign/Link/resource"
import { initAuthSignLinkResource } from "../../x_Resource/Sign/Link/impl"

export function initMockRenewCredentialEntryPoint(
    passer: RenewAuthInfoMockPropsPasser
): RenewCredentialEntryPoint {
    return initEntryPoint(initMockRenewAuthInfoResource(passer))
}

export function initMockPasswordLoginEntryPoint(
    passer: AuthenticatePasswordResourceMockPropsPasser
): PasswordLoginEntryPoint {
    return initEntryPoint(initMockPasswordAuthenticateResource(passer))
}

export function initMockPasswordResetSessionEntryPoint(
    passer: StartPasswordResetSessionResourceMockPropsPasser
): PasswordResetSessionEntryPoint {
    return initEntryPoint(initMockStartPasswordResetSessionResource(passer))
}

export function initMockPasswordResetEntryPoint(
    passer: RegisterPasswordResourceMockPropsPasser
): PasswordResetEntryPoint {
    return initEntryPoint(initMockRegisterPasswordResource(passer))
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

export function initMockLoginEntryPointAsError(
    passer: LoginErrorMockPropsPasser
): AuthSignEntryPoint {
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
