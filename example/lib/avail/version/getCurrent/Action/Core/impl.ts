import { getCurrentVersion } from "../../impl"

import { GetCurrentVersionInfra } from "../../infra"

import { GetCurrentVersionCoreAction } from "./action"

export function initGetCurrentVersionCoreAction(
    infra: GetCurrentVersionInfra,
): GetCurrentVersionCoreAction {
    return {
        getCurrent: getCurrentVersion(infra),
    }
}
