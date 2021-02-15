import { MockPropsPasser } from "../../../../../vendor/getto-example/Application/mock"
import {
    initMockClearAuthCredentialComponent,
    ClearAuthCredentialMockProps,
} from "./ClearAuthCredential/mock"

import { AuthProfileLogoutResource } from "./resource"

export type AuthProfileLogoutMockPropsPasser = MockPropsPasser<AuthProfileLogoutMockProps>
export type AuthProfileLogoutMockProps = ClearAuthCredentialMockProps

export function initMockAuthProfileLogoutResource(
    passer: AuthProfileLogoutMockPropsPasser
): AuthProfileLogoutResource {
    return {
        clearAuthCredential: initMockClearAuthCredentialComponent(passer),
    }
}
