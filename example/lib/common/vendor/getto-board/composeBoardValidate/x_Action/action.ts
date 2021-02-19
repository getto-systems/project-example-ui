import { ApplicationAction } from "../../../getto-example/Application/action"

import { ComposeBoardValidateMethod } from "../method"

import { ComposeBoardValidateEvent } from "../event"

import { BoardValidateState_initial, initialBoardValidateState } from "../data"

export type ComposeBoardValidateResource = Readonly<{
    state: ComposeBoardValidateAction
}>

export interface ComposeBoardValidateAction extends ApplicationAction<ComposeBoardValidateState> {
    compose(): void
}

export type ComposeBoardValidateMaterial = Readonly<{
    compose: ComposeBoardValidateMethod
}>

export type ComposeBoardValidateState =
    | ComposeBoardValidateState_initial
    | ComposeBoardValidateEvent

type ComposeBoardValidateState_initial = Readonly<{
    type: "initial-validate"
    state: BoardValidateState_initial
}>

export const initialComposeBoardValidateState: ComposeBoardValidateState_initial = {
    type: "initial-validate",
    state: initialBoardValidateState,
}
