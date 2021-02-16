import { MockPropsPasser } from "../../../../../../../common/vendor/getto-example/Application/mock"

import {
    initMockPasswordResetRegisterFormComponent,
    PasswordResetRegisterFormMockProps,
} from "../../../../../../sign/x_Action/Password/Reset/Register/Form/mock"
import {
    initMockRegisterPasswordResetSessionAction,
    RegisterPasswordResetSessionMockProps,
} from "../../../../../../sign/x_Action/Password/Reset/Register/Core/mock"

import { AuthSignPasswordResetSessionRegisterResource } from "./resource"

export type AuthSignPasswordResetSessionRegisterMockPropsPasser = MockPropsPasser<
    PasswordResetResourceMockProps
>
export type PasswordResetResourceMockProps = RegisterPasswordResetSessionMockProps &
    PasswordResetRegisterFormMockProps

export function initMockAuthSignPasswordResetSessionRegister(
    passer: AuthSignPasswordResetSessionRegisterMockPropsPasser
): AuthSignPasswordResetSessionRegisterResource {
    return {
        register: initMockRegisterPasswordResetSessionAction(passer),
        form: initMockPasswordResetRegisterFormComponent(passer),
    }
}
