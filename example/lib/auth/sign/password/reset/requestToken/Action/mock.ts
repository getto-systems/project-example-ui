import { initSignLinkResource } from "../../../../common/link/Action/impl"

import { initMockCoreAction } from "./Core/mock"
import { initMockRequestResetTokenFormAction } from "./Form/mock"

import { RequestResetTokenResource } from "./entryPoint"

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
