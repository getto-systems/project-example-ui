import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"

import { initMockRegisterPasswordFormAction } from "./Form/mock"
import { initMockRegisterPasswordCoreAction } from "./Core/mock"

import { RegisterPasswordResource } from "./action"

export function initMockRegisterPasswordResource(): RegisterPasswordResource {
    return {
        reset: {
            core: initMockRegisterPasswordCoreAction(),
            form: initMockRegisterPasswordFormAction(),
        },
        ...newAuthSignLinkResource(),
    }
}
