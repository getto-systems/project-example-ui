import { ApplicationView } from "../../z_vendor/getto-application/action/action"
import { SignAction, SignActionState } from "./core/action"

export type SignView = ApplicationView<SignResource>

export type SignResource = Readonly<{
    sign: SignAction
}>
export type SignResourceState = Readonly<{
    state: SignActionState
}>
