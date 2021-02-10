import { CurrentVersionMockPasser, initMockCurrentVersionComponent } from "../currentVersion/mock"

import { NotFoundEntryPoint } from "./entryPoint"

export function newMockNotFound(passer: CurrentVersionMockPasser): NotFoundEntryPoint {
    return {
        resource: {
            currentVersion: initMockCurrentVersionComponent(passer),
        },
        terminate: () => {
            // mock では特に何もしない
        },
    }
}
