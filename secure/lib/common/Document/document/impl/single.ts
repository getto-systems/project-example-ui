import { DocumentFactory } from "../view"

import { DocumentCollectorSet, DocumentFactorySet, initDocumentComponentSet } from "./core"

export type FactorySet = DocumentFactorySet
export type CollectorSet = DocumentCollectorSet

export function initDocumentFactoryAsSingle(
    factory: FactorySet,
    collector: CollectorSet
): DocumentFactory {
    return () => {
        return {
            components: initDocumentComponentSet(factory, collector),
            terminate: () => {
                // worker とインターフェイスを合わせるために必要
            },
        }
    }
}
