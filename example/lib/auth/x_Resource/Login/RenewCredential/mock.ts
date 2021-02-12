import { MockPropsPasser } from "../../../../sub/getto-example/Application/mock"

import { initMockRenewCredential, RenewCredentialMockProps } from "./Renew/mock"

import { RenewCredentialResource } from "./resource"

export type RenewCredentialResourceMockPropsPasser = MockPropsPasser<RenewCredentialResourceMockProps>
export type RenewCredentialResourceMockProps = RenewCredentialMockProps

export function initMockRenewCredentialResource(
    passer: RenewCredentialResourceMockPropsPasser
): RenewCredentialResource {
    return {
        renew: initMockRenewCredential(passer),
    }
}
