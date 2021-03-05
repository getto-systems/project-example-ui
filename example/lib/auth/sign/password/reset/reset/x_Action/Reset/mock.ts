import { newSignLinkResource } from "../../../../../common/link/Action/impl"

import { initMockFormAction } from "./Form/mock"
import { initMockResetPasswordCoreAction } from "./Core/mock"

import { ResetPasswordResource } from "./action"

export function initMockResetPasswordResource(): ResetPasswordResource {
    return {
        reset: {
            core: initMockResetPasswordCoreAction(),
            form: initMockFormAction(),
            terminate: () => null,
        },
        ...newSignLinkResource(),
    }
}
