import { DocumentCollectorSet, DocumentFactorySet, initDocumentComponentSet } from "./core"

import { DocumentResource } from "../view"

export function initDocumentAsSingle(
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
