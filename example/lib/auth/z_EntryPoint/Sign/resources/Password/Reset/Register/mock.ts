import { MockPropsPasser } from "../../../../../../../common/vendor/getto-example/Application/mock"

import { initMockPasswordResetRegisterFormComponent, PasswordResetRegisterFormMockProps } from "../../../../../../sign/x_Action/Password/Reset/Register/Form/mock"
import { initMockPasswordResetRegisterComponent, ResetMockProps } from "../../../../../../sign/x_Action/Password/Reset/Register/Reset/mock"

import { AuthSignPasswordResetResource } from "./resource"

export type PasswordResetResourceMockPropsPasser = MockPropsPasser<PasswordResetResourceMockProps>
export type PasswordResetResourceMockProps = ResetMockProps & PasswordResetRegisterFormMockProps

export function initMockPasswordResetResource(
    passer: PasswordResetResourceMockPropsPasser
): AuthSignPasswordResetResource {
    return {
        register: initMockPasswordResetRegisterComponent(passer),
        form: initMockPasswordResetRegisterFormComponent(passer),
    }
}
