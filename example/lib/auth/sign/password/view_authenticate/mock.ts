import { mockAuthenticatePasswordFormAction } from "./form/mock"
import { mockAuthenticatePasswordCoreAction } from "./core/mock"

import { AuthenticatePasswordResource } from "./entry_point"
import { initSignLinkResource } from "../../common/link/action/impl"

export function initMockAuthenticatePasswordResource(): AuthenticatePasswordResource {
    return {
        authenticate: {
            core: mockAuthenticatePasswordCoreAction(),
            form: mockAuthenticatePasswordFormAction(),
            terminate: () => null,
        },
        ...initSignLinkResource(),
    }
}
