import { mockAuthenticatePasswordFormAction } from "./form/mock"
import { mockAuthenticatePasswordCoreAction } from "./core/mock"

import { AuthenticatePasswordEntryPoint, AuthenticatePasswordResource } from "./entry_point"
import { initSignLinkResource } from "../../common/nav/action_nav/impl"

export function mockAuthenticatePasswordEntryPoint(): AuthenticatePasswordEntryPoint {
    return {
        resource: mockAuthenticatePasswordResource(),
        terminate: () => null,
    }
}
export function mockAuthenticatePasswordResource(): AuthenticatePasswordResource {
    return {
        authenticate: {
            core: mockAuthenticatePasswordCoreAction(),
            form: mockAuthenticatePasswordFormAction(),
            terminate: () => null,
        },
        ...initSignLinkResource(),
    }
}
