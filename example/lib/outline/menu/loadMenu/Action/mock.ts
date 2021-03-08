import { initMockLoadMenuCoreAction, standard_MockMenu } from "./Core/mock"

import { LoadMenuResource } from "./resource"

export function standard_MockLoadMenuResource(): LoadMenuResource {
    return {
        menu: initMockLoadMenuCoreAction(standard_MockMenu()),
    }
}
