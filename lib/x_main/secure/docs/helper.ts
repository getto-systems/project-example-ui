import { DocsOutsideFeature } from "../../../docs/action_docs/init"

export function docsFeature(): DocsOutsideFeature {
    return {
        webStorage: localStorage,
        webDB: indexedDB,
        webCrypto: crypto,
        currentLocation: location,
    }
}
