import { ApplicationComponent } from "../../../../sub/getto-example/Application/component"

import { Find } from "../../../nextVersion/action"

import { AppTarget, FindError } from "../../../nextVersion/data"

export interface NextVersionComponentFactory {
    (material: NextVersionMaterial): NextVersionComponent
}
export type NextVersionMaterial = Readonly<{
    find: Find
}>

export interface NextVersionComponent extends ApplicationComponent<NextVersionComponentState> {
    find(): void
}

export type NextVersionComponentState =
    | Readonly<{ type: "initial-next-version" }>
    | Readonly<{ type: "delayed-to-find" }>
    | Readonly<{ type: "failed-to-find"; err: FindError }>
    | Readonly<{ type: "succeed-to-find"; upToDate: boolean; target: AppTarget }>

export const initialNextVersionComponentState: NextVersionComponentState = {
    type: "initial-next-version",
}
