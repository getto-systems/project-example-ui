import { MockPropsPasser } from "../../../../../common/vendor/getto-example/Application/mock"

import {
    initMockRenewAuthnInfoAction,
    RenewMockProps,
} from "../../../../sign/x_Action/AuthnInfo/Renew/mock"

import { RenewAuthInfoResource } from "./resource"

export type RenewAuthInfoMockPropsPasser = MockPropsPasser<RenewAuthInfoMockProps>
export type RenewAuthInfoMockProps = RenewMockProps

export function initMockRenewAuthInfoResource(
    passer: RenewAuthInfoMockPropsPasser
): RenewAuthInfoResource {
    return {
        renew: initMockRenewAuthnInfoAction(passer),
    }
}
