import { LoadContent } from "../../content/action"
import { ContentPath } from "../../content/data"

export interface ContentComponentFactory {
    (material: ContentMaterial): ContentComponent
}
export type ContentMaterial = Readonly<{
    loadDocument: LoadContent
}>

export interface ContentComponent {
    onStateChange(post: Post<ContentState>): void
    load(): void
}

export type ContentState =
    | Readonly<{ type: "initial-content" }>
    | Readonly<{ type: "succeed-to-load"; path: ContentPath }>

export const initialContentState: ContentState = { type: "initial-content" }

interface Post<T> {
    (state: T): void
}
