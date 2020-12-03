import { StaticDocumentPath } from "../../y_static/path";

export type DocumentPath = StaticDocumentPath
export type LoadDocumentEvent = Readonly<{ type: "succeed-to-load"; path: DocumentPath }>
