import { initNextVersion } from "../next_version/mock"

import { MoveToNextVersionFactory } from "./view"

export function newMoveToNextVersionAsMock(): MoveToNextVersionFactory {
    return () => {
        return {
            components: {
                nextVersion: initNextVersion()
            },
            terminate: () => {
                // mock では特に何もしない
            },
        }
    }
}
