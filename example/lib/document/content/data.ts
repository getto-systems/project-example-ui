import { StaticContentPath, staticContentPaths } from "../../y_static/path";

export type DocumentPath = StaticContentPath
export type LoadDocumentEvent = Readonly<{ type: "succeed-to-load"; path: DocumentPath }>

export const documentPaths = staticContentPaths
