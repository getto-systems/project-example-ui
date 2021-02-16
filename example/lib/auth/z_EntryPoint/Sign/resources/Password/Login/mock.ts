import { MockPropsPasser } from "../../../../../../common/vendor/getto-example/Application/mock"

import {
    initMockPasswordLoginFormComponent,
    PasswordLoginFormMockProps,
} from "../../../../../sign/x_Action/Password/Login/Form/mock"
import {
    initMockPasswordLoginComponent,
    PasswordLoginMockProps,
} from "../../../../../sign/x_Action/Password/Login/Core/mock"

import { AuthSignPasswordLoginResource } from "./resource"

export type AuthSignPasswordLoginMockPropsPasser = MockPropsPasser<AuthSignPasswordLoginMockProps>
export type AuthSignPasswordLoginMockProps = PasswordLoginMockProps & PasswordLoginFormMockProps

export function initMockAuthSignPasswordLoginResource(
    passer: AuthSignPasswordLoginMockPropsPasser
): AuthSignPasswordLoginResource {
    return {
        login: initMockPasswordLoginComponent(passer),
        form: initMockPasswordLoginFormComponent(passer),
    }
}
