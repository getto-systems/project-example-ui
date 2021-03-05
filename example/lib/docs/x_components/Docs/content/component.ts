import { ApplicationStateAction } from "../../../../z_vendor/getto-application/action/action"

import { LoadContent } from "../../../content/action"

import { LoadContentEvent } from "../../../content/event"

export interface ContentComponentFactory {
    (material: ContentMaterial): ContentComponent
}
export type ContentMaterial = Readonly<{
    loadDocument: LoadContent
}>

export type ContentComponent = ApplicationStateAction<ContentComponentState>

export type ContentComponentState = Readonly<{ type: "initial-content" }> | LoadContentEvent

export const initialContentComponentState: ContentComponentState = { type: "initial-content" }
