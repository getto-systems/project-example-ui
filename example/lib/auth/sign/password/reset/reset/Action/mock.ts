import { initSignLinkResource } from "../../../../common/link/Action/impl"

import { initMockResetPasswordFormAction } from "./Form/mock"
import { initMockResetPasswordCoreAction } from "./Core/mock"

import { ResetPasswordResource } from "./action"

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
