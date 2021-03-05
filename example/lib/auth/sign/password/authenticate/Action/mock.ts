import { initMockAuthenticatePasswordFormAction } from "./Form/mock"
import { initMockAuthenticatePasswordCoreAction } from "./Core/mock"

import { AuthenticatePasswordResource } from "./entryPoint"
import { initSignLinkResource } from "../../../common/link/Action/impl"

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
