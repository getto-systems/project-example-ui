import { StaticContentPath, staticContentPaths } from "../../y_static/path";

export type ContentPath = StaticContentPath
export type LoadContentEvent = Readonly<{ type: "succeed-to-load"; path: ContentPath }>

export const contentPaths = staticContentPaths
