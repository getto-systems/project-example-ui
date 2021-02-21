import { initMockAuthenticatePasswordFormAction } from "./Form/mock"
import { initMockAuthenticatePasswordCoreAction } from "./Core/mock"

import { AuthenticatePasswordResource } from "./action"
import { newAuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/impl"

export function initMockAuthenticatePasswordResource(): AuthenticatePasswordResource {
    return {
        authenticate: {
            core: initMockAuthenticatePasswordCoreAction(),
            form: initMockAuthenticatePasswordFormAction(),
        },
        ...newAuthSignLinkResource(),
    }
}
