import { newSignSearchResource } from "../../../../../common/search/Action/impl"

import { initMockCoreAction } from "./Core/mock"
import { initMockFormAction } from "./Form/mock"

import { RequestPasswordResetTokenResource } from "./action"

export function initMockRequestPasswordResetTokenResource(): RequestPasswordResetTokenResource {
    return {
        requestToken: {
            core: initMockCoreAction(),
            form: initMockFormAction(),
            terminate: () => null,
        },
        ...newSignSearchResource(),
    }
}
