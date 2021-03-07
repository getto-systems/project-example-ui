import { ApplicationMockStateAction } from "../../../../../z_vendor/getto-application/action/impl"

import {
    FindNextVersionCoreActionState,
    FindNextVersionCoreAction,
    initialFindNextVersionCoreActionState,
} from "./action"

export function initMockFindNextVersionCoreAction(): FindNextVersionCoreAction {
    return new Action()
}

class Action
    extends ApplicationMockStateAction<FindNextVersionCoreActionState>
    implements FindNextVersionCoreAction {
    readonly initialState = initialFindNextVersionCoreActionState

    find(): void {
        // mock ではなにもしない
    }
}
