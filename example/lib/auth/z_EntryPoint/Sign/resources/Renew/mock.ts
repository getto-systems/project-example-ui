import { MockPropsPasser } from "../../../../../common/vendor/getto-example/Application/mock"

import {
    initMockRenewAuthCredentialComponent,
    RenewMockProps,
} from "../../../../sign/x_Action/AuthCredential/Renew/mock"

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
