import { GetCurrentVersionResource } from "./resource"
import { GetCurrentVersionCoreAction } from "./Core/action"

export function initGetCurrentVersionResource(
    version: GetCurrentVersionCoreAction,
): GetCurrentVersionResource {
    return { version }
}
