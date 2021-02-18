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
    | Readonly<{ type: "initial-validate"; state: BoardValidateState_initial }>
    | ComposeBoardValidateEvent

export const initialComposeBoardValidateState = {
    type: "initial-validate",
    state: initialBoardValidateState,
} as const
