import { MockPropsPasser } from "../../../../../vendor/getto-example/Application/mock"
import {
    initMockClearAuthCredentialComponent,
    ClearAuthCredentialMockProps,
} from "../../../../sign/x_Component/AuthCredential/Clear/mock"

import { AuthProfileLogoutResource } from "./resource"

export type AuthProfileLogoutResourceMockPropsPasser = MockPropsPasser<ClearAuthCredentialMockProps>
export type AuthProfileLogoutResourceMockProps = ClearAuthCredentialMockProps

export function initMockAuthProfileLogoutResource(
    passer: AuthProfileLogoutResourceMockPropsPasser
): AuthProfileLogoutResource {
    return {
        clear: initMockClearAuthCredentialComponent(passer),
    }
}
