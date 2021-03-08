import { LoadMenuCoreAction, LoadMenuCoreState } from "./Core/action"

export type LoadMenuResource = Readonly<{
    menu: LoadMenuCoreAction
}>
export type LoadMenuResourceState = Readonly<{
    state: LoadMenuCoreState
}>
