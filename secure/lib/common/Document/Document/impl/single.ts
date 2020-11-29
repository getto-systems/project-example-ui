import { DocumentResource } from "../view"

import { DocumentCollectorSet, DocumentFactorySet, initDocumentComponentSet } from "./core"

export function initDocumentFactoryAsSingle(
    factory: DocumentFactorySet,
    collector: DocumentCollectorSet
): DocumentResource {
    return {
        components: initDocumentComponentSet(factory, collector),
        terminate: () => {
            // worker とインターフェイスを合わせるために必要
        },
    }
}
