import { LoadDocument } from "../action"

export const loadDocument = (): LoadDocument => (collector) => (post) => {
    post({ type: "succeed-to-load", path: collector.getDocumentPath() })
}
