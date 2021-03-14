import { ApplicationEntryPoint } from "../../z_vendor/getto-application/action/action"
import { SignAction, SignActionState } from "./core/action"

export type SignEntryPoint = ApplicationEntryPoint<SignResource>

export type SignResource = Readonly<{
    view: SignAction
}>
export type SignResourceState = Readonly<{
    state: SignActionState
}>
