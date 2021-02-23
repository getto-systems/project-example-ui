import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"

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
        ...newAuthSignLinkResource(),
    }
}
