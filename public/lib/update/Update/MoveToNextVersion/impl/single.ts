import {
    initMoveToNextVersionComponentSet,
    MoveToNextVersionCollectorSet,
    MoveToNextVersionFactorySet,
} from "./core"

import { MoveToNextVersionResource } from "../view"

export function initMoveToNextVersionAsSingle(
    factory: MoveToNextVersionFactorySet,
    collector: MoveToNextVersionCollectorSet
): MoveToNextVersionResource {
    return {
        components: initMoveToNextVersionComponentSet(factory, collector),
        terminate: () => {
            // worker とインターフェイスを合わせるために必要
        },
    }
}
