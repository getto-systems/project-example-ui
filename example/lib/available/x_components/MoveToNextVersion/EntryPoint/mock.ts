import { initMockNextVersionComponent, NextVersionMockPropsPasser } from "../nextVersion/mock"

import { MoveToNextVersionEntryPoint } from "./entryPoint"

export function newMockMoveToNextVersion(
    passer: NextVersionMockPropsPasser
): MoveToNextVersionEntryPoint {
    const resource = {
        nextVersion: initMockNextVersionComponent(passer),
    }
    return {
        resource,
        terminate: () => {
            // mock では特に何もしない
        },
    }
}
