import { mockCheckAuthTicketCoreAction } from "./core/mock"

import { CheckAuthTicketEntryPoint, CheckAuthTicketResource } from "./entry_point"

export function mockCheckAuthTicketEntryPoint(): CheckAuthTicketEntryPoint {
    return {
        resource: mockCheckAuthTicketResource(),
        terminate: () => null,
    }
}
export function mockCheckAuthTicketResource(): CheckAuthTicketResource {
    return { core: mockCheckAuthTicketCoreAction() }
}
