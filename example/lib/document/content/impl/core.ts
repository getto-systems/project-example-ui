import { LoadContentPod } from "../action"

export const loadDocument = (): LoadContentPod => (collector) => (post) => {
    post({ type: "succeed-to-load", path: collector.getContentPath() })
}
