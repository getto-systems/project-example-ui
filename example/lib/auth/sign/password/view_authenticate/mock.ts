import { initMockAuthenticatePasswordFormAction } from "./form/mock"
import { initMockAuthenticatePasswordCoreAction } from "./core/mock"

import { AuthenticatePasswordResource } from "./entry_point"
import { initSignLinkResource } from "../../common/link/action/impl"

export function initMockAuthenticatePasswordResource(): AuthenticatePasswordResource {
    return {
        authenticate: {
            core: initMockAuthenticatePasswordCoreAction(),
            form: initMockAuthenticatePasswordFormAction(),
            terminate: () => null,
        },
        ...initSignLinkResource(),
    }
}
