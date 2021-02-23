import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"

import { initMockRequestPasswordResetTokenCoreAction } from "./Core/mock"
import { initMockRequestPasswordResetTokenFormAction } from "./Form/mock"

import { RequestPasswordResetTokenResource } from "./action"

export function initMockRequestPasswordResetTokenResource(): RequestPasswordResetTokenResource {
    return {
        request: {
            core: initMockRequestPasswordResetTokenCoreAction(),
            form: initMockRequestPasswordResetTokenFormAction(),
            terminate: () => null,
        },
        ...newAuthSignLinkResource(),
    }
}
