import { ApplicationComponent } from "../../../../sub/getto-example/x_components/Application/component"

import { LoadContent } from "../../../content/action"

import { ContentPath } from "../../../content/data"

export interface ContentComponentFactory {
    (material: ContentMaterial): ContentComponent
}
export type ContentMaterial = Readonly<{
    loadDocument: LoadContent
}>

export interface ContentComponent extends ApplicationComponent<ContentComponentState> {
    load(): void
}

export type ContentComponentState =
    | Readonly<{ type: "initial-content" }>
    | Readonly<{ type: "succeed-to-load"; path: ContentPath }>

export const initialContentComponentState: ContentComponentState = { type: "initial-content" }
