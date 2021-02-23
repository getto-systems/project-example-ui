import { initMockFormAction } from "./Form/mock"
import { initMockCoreAction } from "./Core/mock"

import { AuthenticatePasswordResource } from "./action"
import { newAuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/impl"

export function initMockAuthenticatePasswordResource(): AuthenticatePasswordResource {
    return {
        authenticate: {
            core: initMockCoreAction(),
            form: initMockFormAction(),
            terminate: () => null,
        },
        ...newAuthSignLinkResource(),
    }
}
