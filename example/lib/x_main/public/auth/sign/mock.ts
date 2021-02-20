import { MockAction, MockPropsPasser } from "../../../../z_getto/application/mock"

import {
    initMockStartPasswordResetSessionResource,
    StartPasswordResetSessionResourceMockPropsPasser,
} from "../../../../auth/x_Resource/Sign/Password/ResetSession/Start/mock"
import {
    initMockRegisterPasswordResource,
    RegisterPasswordResourceMockPropsPasser,
} from "../../../../auth/x_Resource/Sign/Password/ResetSession/Register/mock"
import {
    initMockRenewAuthnInfoAction,
    RenewAuthnInfoMockPropsPasser,
} from "../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/mock"

import {
    AuthSignEntryPoint,
    AuthSignView,
    AuthSignViewState,
    RenewCredentialEntryPoint,
    PasswordResetSessionEntryPoint,
    PasswordResetEntryPoint,
} from "./entryPoint"

import { AuthSignLinkResource } from "../../../../auth/sign/common/searchParams/x_Action/Link/action"

import { RenewAuthnInfoResource } from "../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/action"

import { newAuthSignLinkResource } from "../../../../auth/sign/common/searchParams/x_Action/Link/impl"

export function initMockRenewCredentialEntryPoint(
    passer: RenewAuthnInfoMockPropsPasser
): RenewCredentialEntryPoint {
    return initEntryPoint(<RenewAuthnInfoResource>{ renew: initMockRenewAuthnInfoAction(passer) })
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
        resource: { ...resource, ...newAuthSignLinkResource() },
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
