import { NotifyUnexpectedErrorCoreAction } from "./action"

export function initMockNotifyUnexpectedErrorCoreAction(): NotifyUnexpectedErrorCoreAction {
    return {
        notify: () => {
            // mock では特に何もしない
        },
    }
}
