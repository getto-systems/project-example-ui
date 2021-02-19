import {
    initMockPropsPasser,
    MockPropsPasser,
} from "../../../../../../common/vendor/getto-example/Application/mock"

import { initMockAuthenticatePasswordFormAction } from "./Form/mock"
import {
    initMockAuthenticatePasswordCoreAction,
    AuthenticatePasswordCoreMockProps,
} from "./Core/mock"

import { AuthenticatePasswordEntryPoint } from "./action"
import { newAuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/impl"

export type AuthenticatePasswordActionMockPropsPasser = MockPropsPasser<
    AuthenticatePasswordActionMockProps
>
export type AuthenticatePasswordActionMockProps = AuthenticatePasswordCoreMockProps

export function initMockAuthenticatePasswordEntryPoint(
    passer: AuthenticatePasswordActionMockPropsPasser
): AuthenticatePasswordEntryPoint {
    return {
        resource: {
            core: initMockAuthenticatePasswordCoreAction(passer),
            form: initMockAuthenticatePasswordFormAction(initMockPropsPasser()),
            ...newAuthSignLinkResource(),
        },
        terminate: () => null,
    }
}
