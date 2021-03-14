import { mockCheckResetTokenSendingStatusCoreAction } from "./core/mock"

import { initSignLinkResource } from "../../../common/nav/action_nav/impl"

import {
    CheckResetTokenSendingStatusEntryPoint,
    CheckResetTokenSendingStatusResource,
} from "./entry_point"

export function mockCheckResetTokenSendingStatusEntryPoint(): CheckResetTokenSendingStatusEntryPoint {
    return {
        resource: mockCheckResetTokenSendingStatusResource(),
        terminate: () => null,
    }
}
export function mockCheckResetTokenSendingStatusResource(): CheckResetTokenSendingStatusResource {
    return {
        checkStatus: mockCheckResetTokenSendingStatusCoreAction(),
        ...initSignLinkResource(),
    }
}
