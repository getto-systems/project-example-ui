import { MockPropsPasser } from "../../../../../../vendor/getto-example/Application/mock"

import {
    initMockPasswordLoginFormComponent,
    PasswordLoginFormMockProps,
} from "../../../../../sign/x_Component/Password/Login/Form/mock"
import {
    initMockPasswordLoginComponent,
    PasswordLoginMockProps,
} from "../../../../../sign/x_Component/Password/Login/Core/mock"

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
