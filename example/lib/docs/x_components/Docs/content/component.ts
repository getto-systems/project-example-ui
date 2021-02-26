import { ApplicationStateAction } from "../../../../z_vendor/getto-application/action/action"

import { LoadContent } from "../../../content/action"

import { ContentPath } from "../../../content/data"

export interface ContentComponentFactory {
    (material: ContentMaterial): ContentComponent
}
export type ContentMaterial = Readonly<{
    loadDocument: LoadContent
}>

export type ContentComponent = ApplicationStateAction<ContentComponentState>

export type ContentComponentState =
    | Readonly<{ type: "initial-content" }>
    | Readonly<{ type: "succeed-to-load"; path: ContentPath }>

export const initialContentComponentState: ContentComponentState = { type: "initial-content" }
