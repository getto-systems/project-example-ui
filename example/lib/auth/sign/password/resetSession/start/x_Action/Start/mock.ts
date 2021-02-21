import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"

import { initMockStartPasswordResetSessionCoreAction } from "./Core/mock"
import { initMockStartPasswordResetSessionFormAction } from "./Form/mock"

import { StartPasswordResetSessionResource } from "./action"

export function initMockStartPasswordResetSessionResource(): StartPasswordResetSessionResource {
    return {
        start: {
            core: initMockStartPasswordResetSessionCoreAction(),
            form: initMockStartPasswordResetSessionFormAction(),
        },
        ...newAuthSignLinkResource(),
    }
}
