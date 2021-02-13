import {
    CurrentVersionMockPropsPasser,
    initMockCurrentVersionComponent,
} from "../../x_Resource/GetCurrentVersion/currentVersion/mock"

import { NotFoundEntryPoint } from "./entryPoint"

export function newMockNotFound(passer: CurrentVersionMockPropsPasser): NotFoundEntryPoint {
    return {
        resource: {
            currentVersion: initMockCurrentVersionComponent(passer),
        },
        terminate: () => {
            // mock では特に何もしない
        },
    }
}
