import { MockPropsPasser } from "../../../../common/getto-example/Application/mock"

import { initMockFormComponent, FormMockProps } from "./Form/mock"
import { initMockLoginComponent, LoginMockProps } from "./Login/mock"

import { PasswordLoginResource } from "./resource"

export type PasswordLoginResourceMockPropsPasser = MockPropsPasser<PasswordLoginResourceMockProps>
export type PasswordLoginResourceMockProps = LoginMockProps & FormMockProps

export function initMockPasswordLoginResource(
    passer: PasswordLoginResourceMockPropsPasser
): PasswordLoginResource {
    return {
        login: initMockLoginComponent(passer),
        form: initMockFormComponent(passer),
    }
}
