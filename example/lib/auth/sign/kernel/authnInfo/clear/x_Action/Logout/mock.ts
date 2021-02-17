import { MockPropsPasser } from "../../../../../../../common/vendor/getto-example/Application/mock"
import {
    ClearAuthnInfoMockProps,
    initMockClearAuthnInfoAction,
} from "./Core/mock"

import { LogoutResource } from "./resource"

export type LogoutResourceMockPropsPasser = MockPropsPasser<LogoutResourceMockProps>
export type LogoutResourceMockProps = ClearAuthnInfoMockProps

export function initMockLogoutResource(
    passer: LogoutResourceMockPropsPasser
): LogoutResource {
    return {
        clear: initMockClearAuthnInfoAction(passer),
    }
}
