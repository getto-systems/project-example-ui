import { MockPropsPasser } from "../../../../../../common/vendor/getto-example/Application/mock"

import {
    initMockAuthenticatePasswordFormAction,
    AuthenticatePasswordFormMockProps,
} from "./Form/mock"
import {
    initMockAuthenticatePasswordCoreAction,
    AuthenticatePasswordCoreMockProps,
} from "./Core/mock"

import { AuthenticatePasswordEntryPoint } from "./action"
import { initAuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/impl"

export type AuthenticatePasswordResourceMockPropsPasser = MockPropsPasser<
    AuthenticatePasswordResourceMockProps
>
export type AuthenticatePasswordResourceMockProps = AuthenticatePasswordCoreMockProps &
    AuthenticatePasswordFormMockProps

export function initMockAuthenticatePasswordEntryPoint(
    passer: AuthenticatePasswordResourceMockPropsPasser
): AuthenticatePasswordEntryPoint {
    return {
        resource: {
            core: initMockAuthenticatePasswordCoreAction(passer),
            form: initMockAuthenticatePasswordFormAction(passer),
            ...initAuthSignLinkResource(),
        },
        terminate: () => null,
    }
}
