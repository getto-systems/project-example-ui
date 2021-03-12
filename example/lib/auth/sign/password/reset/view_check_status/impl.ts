import { initSignLinkResource } from "../../../common/nav/action_nav/impl"

import { CheckResetTokenSendingStatusEntryPoint } from "./entry_point"

import { CheckResetTokenSendingStatusCoreAction } from "./core/action"

export function initCheckResetTokenSendingStatusEntryPoint(
    action: CheckResetTokenSendingStatusCoreAction,
): CheckResetTokenSendingStatusEntryPoint {
    return {
        resource: { checkStatus: action, ...initSignLinkResource() },
        terminate: () => action.terminate(),
    }
}
