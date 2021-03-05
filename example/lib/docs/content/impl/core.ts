import { LoadContentLocationDetectMethod, LoadContentLocationKeys, LoadContentPod } from "../action"
import { contentPathLocationConverter } from "../convert"

interface Detecter {
    (keys: LoadContentLocationKeys): LoadContentLocationDetectMethod
}
export const detectContentPath: Detecter = (keys) => (currentURL) =>
    contentPathLocationConverter(currentURL, keys.version)

export const loadContent = (): LoadContentPod => (detecter) => (post) => {
    post({ type: "succeed-to-load", path: detecter() })
}
