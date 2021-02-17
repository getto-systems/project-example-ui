import { MockPropsPasser } from "../../../../../common/vendor/getto-example/Application/mock"

import {
    initMockAuthenticatePasswordFormAction,
    AuthenticatePasswordFormMockProps,
} from "../../../../sign/x_Action/Password/Authenticate/Form/mock"
import {
    initMockAuthenticatePasswordAction,
    AuthenticatePasswordMockProps,
} from "../../../../sign/x_Action/Password/Authenticate/Core/mock"

import { AuthenticatePasswordResource } from "./resource"

export type AuthenticatePasswordResourceMockPropsPasser = MockPropsPasser<
    AuthenticatePasswordResourceMockProps
>
export type AuthenticatePasswordResourceMockProps = AuthenticatePasswordMockProps &
    AuthenticatePasswordFormMockProps

export function initMockPasswordAuthenticateResource(
    passer: AuthenticatePasswordResourceMockPropsPasser
): AuthenticatePasswordResource {
    return {
        authenticate: initMockAuthenticatePasswordAction(passer),
        form: initMockAuthenticatePasswordFormAction(passer),
    }
}
