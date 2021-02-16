import { MockPropsPasser } from "../../../../../common/vendor/getto-example/Application/mock"
import {
    ClearAuthnInfoMockProps,
    initMockClearAuthnInfoAction,
} from "../../../../sign/x_Action/AuthnInfo/Clear/mock"

import { AuthProfileLogoutResource } from "./resource"

export type AuthProfileLogoutResourceMockPropsPasser = MockPropsPasser<
    AuthProfileLogoutResourceMockProps
>
export type AuthProfileLogoutResourceMockProps = ClearAuthnInfoMockProps

export function initMockAuthProfileLogoutResource(
    passer: AuthProfileLogoutResourceMockPropsPasser
): AuthProfileLogoutResource {
    return {
        clear: initMockClearAuthnInfoAction(passer),
    }
}
