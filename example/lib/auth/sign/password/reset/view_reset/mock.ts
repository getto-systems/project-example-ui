import { initSignLinkResource } from "../../../common/link/action/impl"

import { mockResetPasswordFormAction } from "./form/mock"
import { mockResetPasswordCoreAction } from "./core/mock"

import { ResetPasswordEntryPoint, ResetPasswordResource } from "./entry_point"

export function mockResetPasswordEntryPoint(): ResetPasswordEntryPoint {
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
