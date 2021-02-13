import { MockPropsPasser } from "../../../../common/getto-example/Application/mock"

import { initMockFormComponent, FormMockProps } from "./Form/mock"
import { initMockStartComponent, StartMockProps } from "./Start/mock"

import { PasswordResetSessionResource } from "./resource"

export type PasswordResetSessionResourceMockPropsPasser = MockPropsPasser<
    PasswordResetSessionResourceMockProps
>
export type PasswordResetSessionResourceMockProps = StartMockProps & FormMockProps

export function initMockPasswordResetSessionResource(
    passer: PasswordResetSessionResourceMockPropsPasser
): PasswordResetSessionResource {
    return {
        start: initMockStartComponent(passer),
        form: initMockFormComponent(passer),
    }
}
