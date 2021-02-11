import { delayed } from "../../../../../z_infra/delayed/core"

import { find } from "../../../../nextVersion/impl/core"

import { CheckRemoteAccess, NextVersionActionConfig } from "../../../../nextVersion/infra"

import { NextVersionAction } from "../../../../nextVersion/action"

export type NextVersionRemoteAccess = Readonly<{
    check: CheckRemoteAccess
}>
export function initNextVersionAction(
    config: NextVersionActionConfig,
    remote: NextVersionRemoteAccess
): NextVersionAction {
    return {
        find: find({
            config: config.find,
            check: remote.check,
            delayed,
        }),
    }
}
