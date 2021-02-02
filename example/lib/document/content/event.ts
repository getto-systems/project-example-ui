import { ContentPath } from "./data";

export type LoadContentEvent = Readonly<{ type: "succeed-to-load"; path: ContentPath }>
