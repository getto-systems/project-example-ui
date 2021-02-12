import { MockPropsPasser } from "../../../../sub/getto-example/Application/mock"

import { initMockRenewComponent, RenewMockProps } from "./Renew/mock"

import { RenewCredentialResource } from "./resource"

export type RenewCredentialResourceMockPropsPasser = MockPropsPasser<RenewCredentialResourceMockProps>
export type RenewCredentialResourceMockProps = RenewMockProps

export function initMockRenewCredentialResource(
    passer: RenewCredentialResourceMockPropsPasser
): RenewCredentialResource {
    return {
        renew: initMockRenewComponent(passer),
    }
}
