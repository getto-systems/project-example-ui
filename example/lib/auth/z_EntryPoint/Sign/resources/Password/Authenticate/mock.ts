import { MockPropsPasser } from "../../../../../../common/vendor/getto-example/Application/mock"

import {
    initMockPasswordLoginFormComponent,
    PasswordLoginFormMockProps,
} from "../../../../../sign/x_Action/Password/Authenticate/Form/mock"
import {
    initMockAuthenticatePasswordAction,
    AuthenticatePasswordMockProps,
} from "../../../../../sign/x_Action/Password/Authenticate/Core/mock"

import { AuthSignPasswordAuthenticateResource } from "./resource"

export type AuthSignPasswordAuthenticateMockPropsPasser = MockPropsPasser<
    AuthSignPasswordAuthenticateMockProps
>
export type AuthSignPasswordAuthenticateMockProps = AuthenticatePasswordMockProps &
    PasswordLoginFormMockProps

export function initMockAuthSignPasswordAuthenticateResource(
    passer: AuthSignPasswordAuthenticateMockPropsPasser
): AuthSignPasswordAuthenticateResource {
    return {
        authenticate: initMockAuthenticatePasswordAction(passer),
        form: initMockPasswordLoginFormComponent(passer),
    }
}
