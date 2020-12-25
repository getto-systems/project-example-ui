import { FindPod, FindCollector } from "../../../nextVersion/action"
import { NextVersionComponentFactory } from "../../nextVersion/component"
import { NextVersionResource } from "../view"

export type NextVersionFactory = Readonly<{
    actions: Readonly<{
        nextVersion: Readonly<{
            find: FindPod
        }>
    }>
    components: Readonly<{
        nextVersion: NextVersionComponentFactory
    }>
}>
export type NextVersionCollector = Readonly<{
    nextVersion: FindCollector
}>
export function initNextVersionResource(
    factory: NextVersionFactory,
    collector: NextVersionCollector
): NextVersionResource {
    const actions = {
        find: factory.actions.nextVersion.find(collector.nextVersion),
    }
    return {
        nextVersion: factory.components.nextVersion(actions),
    }
}
