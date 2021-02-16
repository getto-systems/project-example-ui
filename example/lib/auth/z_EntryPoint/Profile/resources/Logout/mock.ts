import { MockPropsPasser } from "../../../../../common/vendor/getto-example/Application/mock"
import {
    ClearAuthCredentialMockProps,
    initMockClearAuthCredentialAction,
} from "../../../../sign/x_Action/AuthCredential/Clear/mock"

import { AuthProfileLogoutResource } from "./resource"

export type AuthProfileLogoutResourceMockPropsPasser = MockPropsPasser<
    AuthProfileLogoutResourceMockProps
>
export type AuthProfileLogoutResourceMockProps = ClearAuthCredentialMockProps

export function initMockAuthProfileLogoutResource(
    passer: AuthProfileLogoutResourceMockPropsPasser
): AuthProfileLogoutResource {
    return {
        clear: initMockClearAuthCredentialAction(passer),
    }
}
