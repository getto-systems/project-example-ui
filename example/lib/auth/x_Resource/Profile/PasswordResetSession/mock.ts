import { MockPropsPasser } from "../../../../sub/getto-example/x_components/Application/mock"

import { initMockPasswordResetSessionForm, PasswordResetSessionFormMockProps } from "./Form/mock"
import { initMockPasswordResetSession, PasswordResetSessionMockProps } from "./Session/mock"

import { PasswordResetSessionResource } from "./resource"

export type PasswordResetSessionResourceMockPropsPasser = MockPropsPasser<
    PasswordResetSessionResourceMockProps
>
export type PasswordResetSessionResourceMockProps = PasswordResetSessionMockProps &
    PasswordResetSessionFormMockProps

export function initMockPasswordResetSessionResource(
    passer: PasswordResetSessionResourceMockPropsPasser
): PasswordResetSessionResource {
    return {
        session: initMockPasswordResetSession(passer),
        form: initMockPasswordResetSessionForm(passer),
    }
}
