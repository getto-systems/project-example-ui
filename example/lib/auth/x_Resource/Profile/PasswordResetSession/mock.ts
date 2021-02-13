import { MockPropsPasser } from "../../../../common/getto-example/Application/mock"

import { initMockFormComponent, FormMockProps } from "./Form/mock"
import { initMockSessionComponent, SessionMockProps } from "./Session/mock"

import { PasswordResetSessionResource } from "./resource"

export type PasswordResetSessionResourceMockPropsPasser = MockPropsPasser<
    PasswordResetSessionResourceMockProps
>
export type PasswordResetSessionResourceMockProps = SessionMockProps & FormMockProps

export function initMockPasswordResetSessionResource(
    passer: PasswordResetSessionResourceMockPropsPasser
): PasswordResetSessionResource {
    return {
        session: initMockSessionComponent(passer),
        form: initMockFormComponent(passer),
    }
}
