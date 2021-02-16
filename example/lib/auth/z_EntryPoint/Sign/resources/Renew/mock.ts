import { MockPropsPasser } from "../../../../../common/vendor/getto-example/Application/mock"

import {
    initMockRenewAuthnInfoAction,
    RenewMockProps,
} from "../../../../sign/x_Action/AuthnInfo/Renew/mock"

import { AuthSignRenewResource } from "./resource"

export type AuthSignRenewMockPropsPasser = MockPropsPasser<AuthSignRenewMockProps>
export type AuthSignRenewMockProps = RenewMockProps

export function initMockAuthSignRenewResource(
    passer: AuthSignRenewMockPropsPasser
): AuthSignRenewResource {
    return {
        renew: initMockRenewAuthnInfoAction(passer),
    }
}
