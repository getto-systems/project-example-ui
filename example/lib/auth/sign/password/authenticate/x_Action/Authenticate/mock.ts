import { MockPropsPasser } from "../../../../../../common/vendor/getto-example/Application/mock"

import {
    initMockAuthenticatePasswordFormAction,
    AuthenticatePasswordFormMockProps,
} from "./Form/mock"
import {
    initMockAuthenticatePasswordCoreAction,
    AuthenticatePasswordCoreMockProps,
} from "./Core/mock"

import { AuthenticatePasswordResource } from "./action"

export type AuthenticatePasswordResourceMockPropsPasser = MockPropsPasser<
    AuthenticatePasswordResourceMockProps
>
export type AuthenticatePasswordResourceMockProps = AuthenticatePasswordCoreMockProps &
    AuthenticatePasswordFormMockProps

export function initMockPasswordAuthenticateResource(
    passer: AuthenticatePasswordResourceMockPropsPasser
): AuthenticatePasswordResource {
    return {
        core: initMockAuthenticatePasswordCoreAction(passer),
        form: initMockAuthenticatePasswordFormAction(passer),
    }
}
