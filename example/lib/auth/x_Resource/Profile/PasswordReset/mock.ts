import { MockPropsPasser } from "../../../../sub/getto-example/Application/mock"

import { initMockFormComponent, FormMockProps } from "./Form/mock"
import { initMockResetComponent, ResetMockProps } from "./Reset/mock"

import { PasswordResetResource } from "./resource"

export type PasswordResetResourceMockPropsPasser = MockPropsPasser<PasswordResetResourceMockProps>
export type PasswordResetResourceMockProps = ResetMockProps & FormMockProps

export function initMockPasswordResetResource(
    passer: PasswordResetResourceMockPropsPasser
): PasswordResetResource {
    return {
        reset: initMockResetComponent(passer),
        form: initMockFormComponent(passer),
    }
}
