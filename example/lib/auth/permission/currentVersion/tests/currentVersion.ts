import { findCurrentVersion } from "../impl/core"

import { FindCurrentVersionAction } from "../action"

export function initTestCurrentVersionAction(currentVersion: string): FindCurrentVersionAction {
    return {
        findCurrentVersion: findCurrentVersion({
            currentVersion,
        }),
    }
}
