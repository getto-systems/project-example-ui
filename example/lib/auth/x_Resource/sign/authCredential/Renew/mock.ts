import { MockPropsPasser } from "../../../../../vendor/getto-example/Application/mock"

import { initMockRenewAuthCredentialComponent, RenewMockProps } from "./Renew/mock"

import { AuthSignAuthCredentialClearResource } from "./resource"

export type RenewCredentialResourceMockPropsPasser = MockPropsPasser<RenewCredentialResourceMockProps>
export type RenewCredentialResourceMockProps = RenewMockProps

export function initMockRenewCredentialResource(
    passer: RenewCredentialResourceMockPropsPasser
): AuthSignAuthCredentialClearResource {
    return {
        renew: initMockRenewAuthCredentialComponent(passer),
    }
}
