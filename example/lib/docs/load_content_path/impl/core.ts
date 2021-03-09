import { docsContentPathLocationConverter } from "./convert"

import { LoadDocsContentPathLocationDetectMethod, LoadDocsContentPathLocationKeys, LoadDocsContentPathPod } from "../method"

import { homeDocsContentPath } from "../data"

interface Detecter {
    (keys: LoadDocsContentPathLocationKeys): LoadDocsContentPathLocationDetectMethod
}
export const detectDocsContentPath: Detecter = (keys) => (currentURL) =>
    docsContentPathLocationConverter(currentURL, keys.version)

export const loadDocsContentPath: LoadDocsContentPathPod = (detecter) => () => {
    const result = detecter()
    if (!result.valid) {
        return homeDocsContentPath
    }
    return result.value
}
