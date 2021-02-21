import { MockAction, MockPropsPasser } from "../../../../z_getto/application/mock"

import {
    initMockStartPasswordResetSessionResource,
    StartPasswordResetSessionResourceMockPropsPasser,
} from "../../../../auth/sign/password/resetSession/start/x_Action/Start/mock"

import {
    AuthSignEntryPoint,
    AuthSignView,
    AuthSignViewState,
    PasswordResetSessionEntryPoint,
} from "./entryPoint"

import { AuthSignLinkResource } from "../../../../auth/sign/common/searchParams/x_Action/Link/action"

import { newAuthSignLinkResource } from "../../../../auth/sign/common/searchParams/x_Action/Link/impl"

export function initMockPasswordResetSessionEntryPoint(
    passer: StartPasswordResetSessionResourceMockPropsPasser
): PasswordResetSessionEntryPoint {
    return initEntryPoint(initMockStartPasswordResetSessionResource(passer))
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
