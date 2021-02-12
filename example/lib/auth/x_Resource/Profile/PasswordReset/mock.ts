import { MockPropsPasser } from "../../../../sub/getto-example/Application/mock"

import { initMockPasswordResetForm, PasswordResetFormMockProps } from "./Form/mock"
import { initMockPasswordReset, PasswordResetMockProps } from "./Reset/mock"

import { PasswordResetResource } from "./resource"

export type PasswordResetResourceMockPropsPasser = MockPropsPasser<PasswordResetResourceMockProps>
export type PasswordResetResourceMockProps = PasswordResetMockProps & PasswordResetFormMockProps

export function initMockPasswordResetResource(
    passer: PasswordResetResourceMockPropsPasser
): PasswordResetResource {
    return {
        reset: initMockPasswordReset(passer),
        form: initMockPasswordResetForm(passer),
    }
}
