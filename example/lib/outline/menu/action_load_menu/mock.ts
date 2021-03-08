import { initMockLoadMenuCoreAction, standard_MockMenu } from "./core/mock"

import { LoadMenuResource } from "./resource"

export function standard_MockLoadMenuResource(): LoadMenuResource {
    return {
        menu: initMockLoadMenuCoreAction(standard_MockMenu()),
    }
}
