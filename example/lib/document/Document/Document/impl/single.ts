import { DocumentCollectorSet, DocumentFactory, initDocumentComponent } from "./core"

import { DocumentEntryPoint } from "../view"

export function initDocumentAsSingle(
    factory: DocumentFactory,
    collector: DocumentCollectorSet
): DocumentEntryPoint {
    return {
        components: initDocumentComponent(factory, collector),
        terminate: () => {
            // worker とインターフェイスを合わせるために必要
        },
    }
}
