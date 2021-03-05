import { SignAction, SignActionState } from "./Core/action"

export type SignEntryPoint = Readonly<{
    resource: SignResource
    terminate: Terminate
}>
export type SignResource = Readonly<{
    view: SignAction
}>
export type SignResourceState = Readonly<{
    state: SignActionState
}>

interface Terminate {
    (): void
}
