import { ApplicationMockStateAction } from "../../../../z_vendor/getto-application/action/mock"

import {
    FindNextVersionCoreState,
    FindNextVersionCoreAction,
    initialFindNextVersionCoreState,
} from "./action"

export function mockFindNextVersionCoreAction(): FindNextVersionCoreAction {
    return new Action()
}

class Action
    extends ApplicationMockStateAction<FindNextVersionCoreState>
    implements FindNextVersionCoreAction {
    readonly initialState = initialFindNextVersionCoreState

    find(): void {
        // mock ではなにもしない
    }
}
