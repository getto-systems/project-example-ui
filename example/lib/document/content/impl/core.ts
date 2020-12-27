import { LoadContentPod } from "../action"

export const loadContent = (): LoadContentPod => (collector) => (post) => {
    post({ type: "succeed-to-load", path: collector.getContentPath() })
}
