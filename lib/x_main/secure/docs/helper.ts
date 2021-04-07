import { DocsOutsideFeature } from "../../../docs/action_docs/init"

export function docsFeature(): DocsOutsideFeature {
    return {
        webDB: indexedDB,
        webCrypto: crypto,
        currentLocation: location,
    }
}
