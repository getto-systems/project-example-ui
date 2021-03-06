import { initSignLinkResource } from "../../../common/nav/action_nav/impl"

import { mockResetPasswordFormAction } from "./form/mock"
import { mockResetPasswordCoreAction } from "./core/mock"

import { ResetPasswordView, ResetPasswordResource } from "./resource"

export function mockResetPasswordView(): ResetPasswordView {
    return {
        resource: mockResetPasswordResource(),
        terminate: () => null,
    }
}
export function mockResetPasswordResource(): ResetPasswordResource {
    return {
        reset: {
            core: mockResetPasswordCoreAction(),
            form: mockResetPasswordFormAction(),
            terminate: () => null,
        },
        ...initSignLinkResource(),
    }
}
