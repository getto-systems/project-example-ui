import { initSignLinkResource } from "../../../../common/link/Action/impl"

import { CheckResetTokenSendingStatusEntryPoint } from "./entryPoint"

import { CheckResetTokenSendingStatusCoreAction } from "./Core/action"

export function toCheckResetTokenSendingStatusEntryPoint(
    action: CheckResetTokenSendingStatusCoreAction,
): CheckResetTokenSendingStatusEntryPoint {
    return {
        resource: { checkStatus: action, ...initSignLinkResource() },
        terminate: () => action.terminate(),
    }
}
