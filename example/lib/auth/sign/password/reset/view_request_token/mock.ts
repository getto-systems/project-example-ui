import { initSignLinkResource } from "../../../common/link/action/impl"

import { initMockCoreAction } from "./core/mock"
import { initMockRequestResetTokenFormAction } from "./form/mock"

import { RequestResetTokenResource } from "./entry_point"

export function initMockRequestResetTokenResource(): RequestResetTokenResource {
    return {
        requestToken: {
            core: initMockCoreAction(),
            form: initMockRequestResetTokenFormAction(),
            terminate: () => null,
        },
        ...initSignLinkResource(),
    }
}
