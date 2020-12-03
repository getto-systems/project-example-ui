import { StaticDocumentPath, staticDocumentPaths } from "../../y_static/path";

export type DocumentPath = StaticDocumentPath
export type LoadDocumentEvent = Readonly<{ type: "succeed-to-load"; path: DocumentPath }>

export const documentPaths = staticDocumentPaths
