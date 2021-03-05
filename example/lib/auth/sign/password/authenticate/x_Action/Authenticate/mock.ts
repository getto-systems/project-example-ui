import { initMockFormAction } from "./Form/mock"
import { initMockCoreAction } from "./Core/mock"

import { AuthenticatePasswordResource } from "./action"
import { newSignLinkResource } from "../../../../common/link/Action/impl"

export function initMockAuthenticatePasswordResource(): AuthenticatePasswordResource {
    return {
        authenticate: {
            core: initMockCoreAction(),
            form: initMockFormAction(),
            terminate: () => null,
        },
        ...newSignLinkResource(),
    }
}
