import { MockComponent, MockPropsPasser } from "../../../common/getto-example/Application/mock"

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

import {
    LoginEntryPoint,
    LoginView,
    LoginState,
    PasswordLoginEntryPoint,
    RenewCredentialEntryPoint,
    PasswordResetSessionEntryPoint,
    PasswordResetEntryPoint,
} from "./entryPoint"
import { LoginLinkResource } from "../../x_Resource/common/LoginLink/resource"
import { initLoginLinkResource } from "../../x_Resource/common/LoginLink/impl"

export function initMockRenewCredentialEntryPoint(
    passer: RenewCredentialResourceMockPropsPasser
): RenewCredentialEntryPoint {
    return initEntryPoint(initMockRenewCredentialResource(passer))
}

export function initMockPasswordLoginEntryPoint(
    passer: PasswordLoginResourceMockPropsPasser
): PasswordLoginEntryPoint {
    return initEntryPoint(initMockPasswordLoginResource(passer))
}

export function initMockPasswordResetSessionEntryPoint(
    passer: PasswordResetSessionResourceMockPropsPasser
): PasswordResetSessionEntryPoint {
    return initEntryPoint(initMockPasswordResetSessionResource(passer))
}

export function initMockPasswordResetEntryPoint(
    passer: PasswordResetResourceMockPropsPasser
): PasswordResetEntryPoint {
    return initEntryPoint(initMockPasswordResetResource(passer))
}

type EntryPoint<R> = Readonly<{
    resource: R
    terminate: Terminate
}>
interface Terminate {
    (): void
}

function initEntryPoint<R>(resource: R): EntryPoint<R & LoginLinkResource> {
    return {
        resource: { ...resource, ...initLoginLinkResource() },
        terminate,
    }
}

export function initMockLoginEntryPointAsError(passer: LoginErrorMockPropsPasser): LoginEntryPoint {
    return {
        view: new MockErrorView(passer),
        terminate,
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
