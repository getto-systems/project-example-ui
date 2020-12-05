import {
    initMoveToNextVersionResource,
    MoveToNextVersionCollector,
    MoveToNextVersionFactory,
} from "./core"

import { MoveToNextVersionEntryPoint } from "../view"

export function initMoveToNextVersionAsSingle(
    factory: MoveToNextVersionFactory,
    collector: MoveToNextVersionCollector
): MoveToNextVersionEntryPoint {
    return {
        components: initMoveToNextVersionResource(factory, collector),
        terminate: () => {
            // worker とインターフェイスを合わせるために必要
        },
    }
}
