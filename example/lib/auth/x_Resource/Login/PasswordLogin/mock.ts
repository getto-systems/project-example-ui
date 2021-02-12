import { MockPropsPasser } from "../../../../sub/getto-example/x_components/Application/mock"

import { initMockPasswordLoginForm, PasswordLoginFormMockProps } from "./Form/mock"
import { initMockPasswordLogin, PasswordLoginMockProps } from "./Login/mock"

import { PasswordLoginResource } from "./resource"

export type PasswordLoginResourceMockPropsPasser = MockPropsPasser<PasswordLoginResourceMockProps>
export type PasswordLoginResourceMockProps = PasswordLoginMockProps & PasswordLoginFormMockProps

export function initMockPasswordLoginResource(
    passer: PasswordLoginResourceMockPropsPasser
): PasswordLoginResource {
    return {
        login: initMockPasswordLogin(passer),
        form: initMockPasswordLoginForm(passer),
    }
}
