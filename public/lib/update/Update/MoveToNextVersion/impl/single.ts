import {
    initMoveToNextVersionResource,
    MoveToNextVersionCollectorSet,
    MoveToNextVersionFactory,
} from "./core"

import { MoveToNextVersionEntryPoint } from "../view"

export function initMoveToNextVersionAsSingle(
    factory: MoveToNextVersionFactory,
    collector: MoveToNextVersionCollectorSet
): MoveToNextVersionEntryPoint {
    return {
        components: initMoveToNextVersionResource(factory, collector),
        terminate: () => {
            // worker とインターフェイスを合わせるために必要
        },
    }
}
