import {
    initMockPropsPasser,
    MockPropsPasser,
} from "../../../../../../common/vendor/getto-example/Application/mock"

import { initMockAuthenticatePasswordFormResource } from "./Form/mock"
import {
    initMockAuthenticatePasswordCoreAction,
    AuthenticatePasswordCoreMockProps,
} from "./Core/mock"

import { AuthenticatePasswordEntryPoint } from "./action"
import { newAuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/impl"

export type AuthenticatePasswordResourceMockPropsPasser = MockPropsPasser<
    AuthenticatePasswordResourceMockProps
>
export type AuthenticatePasswordResourceMockProps = AuthenticatePasswordCoreMockProps

export function initMockAuthenticatePasswordEntryPoint(
    passer: AuthenticatePasswordResourceMockPropsPasser
): AuthenticatePasswordEntryPoint {
    return {
        resource: {
            core: initMockAuthenticatePasswordCoreAction(passer),
            form: initMockAuthenticatePasswordFormResource(initMockPropsPasser()),
            ...newAuthSignLinkResource(),
        },
        terminate: () => null,
    }
}
