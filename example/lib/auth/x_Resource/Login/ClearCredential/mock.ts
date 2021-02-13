import { MockPropsPasser } from "../../../../common/getto-example/Application/mock"
import { initMockLogoutComponent, LogoutMockProps } from "./Logout/mock"
import { ClearCredentialResource } from "./resource"

export type ClearCredentialResourceMockPropsPasser = MockPropsPasser<ClearCredentialResourceMockProps>
export type ClearCredentialResourceMockProps = LogoutMockProps

export function initMockClearCredentialResource(
    passer: ClearCredentialResourceMockPropsPasser
): ClearCredentialResource {
    return {
        logout: initMockLogoutComponent(passer),
    }
}
