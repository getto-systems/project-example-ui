import { MockStateAction_simple } from "../../../../../../../z_getto/application/mock"

import { RenewAuthnInfoAction, RenewAuthnInfoState } from "./action"

export function initMockRenewAuthnInfoAction(): RenewAuthnInfoAction {
    return new Action()
}

class Action extends MockStateAction_simple<RenewAuthnInfoState> implements RenewAuthnInfoAction {
    request(): void {
        // mock では特に何もしない
    }
    succeedToInstantLoad(): void {
        // mock では特に何もしない
    }
    failedToInstantLoad(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}
