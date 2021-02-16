import { MockPropsPasser } from "../../../../vendor/getto-example/Application/mock"

import { initMockPasswordResetSessionFormComponent, PasswordResetSessionFormMockProps } from "../../../sign/x_Component/Password/Reset/Session/Form/mock"
import { initMockStartComponent, StartMockProps } from "../../../sign/x_Component/Password/Reset/Session/Start/mock"

import { PasswordResetSessionResource } from "./resource"

export type PasswordResetSessionResourceMockPropsPasser = MockPropsPasser<
    PasswordResetSessionResourceMockProps
>
export type PasswordResetSessionResourceMockProps = StartMockProps & PasswordResetSessionFormMockProps

export function initMockPasswordResetSessionResource(
    passer: PasswordResetSessionResourceMockPropsPasser
): PasswordResetSessionResource {
    return {
        start: initMockStartComponent(passer),
        form: initMockPasswordResetSessionFormComponent(passer),
    }
}
