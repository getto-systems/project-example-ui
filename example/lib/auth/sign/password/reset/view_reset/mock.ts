import { initSignLinkResource } from "../../../common/link/action/impl"

import { initMockResetPasswordFormAction } from "./form/mock"
import { initMockResetPasswordCoreAction } from "./core/mock"

import { ResetPasswordResource } from "./entry_point"

export function initMockResetPasswordResource(): ResetPasswordResource {
    return {
        reset: {
            core: initMockResetPasswordCoreAction(),
            form: initMockResetPasswordFormAction(),
            terminate: () => null,
        },
        ...initSignLinkResource(),
    }
}
