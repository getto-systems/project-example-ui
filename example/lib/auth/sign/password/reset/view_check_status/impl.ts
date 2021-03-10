import { initSignLinkResource } from "../../../common/link/action/impl"

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
