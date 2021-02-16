import { MockPropsPasser } from "../../../../../vendor/getto-example/Application/mock"

import {
    initMockRenewAuthCredentialComponent,
    RenewMockProps,
} from "../../../../sign/x_Component/AuthCredential/Renew/mock"

import { AuthSignRenewResource } from "./resource"

export type AuthSignRenewMockPropsPasser = MockPropsPasser<AuthSignRenewMockProps>
export type AuthSignRenewMockProps = RenewMockProps

export function initMockAuthSignRenewResource(
    passer: AuthSignRenewMockPropsPasser
): AuthSignRenewResource {
    return {
        renew: initMockRenewAuthCredentialComponent(passer),
    }
}
