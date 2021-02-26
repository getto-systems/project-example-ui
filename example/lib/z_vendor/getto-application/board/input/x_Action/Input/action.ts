// この infra は UI で実行時に構築されるので、例外的に action で参照していい
import { BoardValueStore } from "../../infra"

import { ApplicationAction } from "../../../../action/action"

import { BoardValue } from "../../../kernel/data"
import { InputBoardValueType } from "../../data"

export type InputBoardValueResource = Readonly<{
    type: InputBoardValueType
    input: InputBoardValueAction
}>

export interface InputBoardValueAction extends ApplicationAction {
    linkStore(store: BoardValueStore): void

    subscribeInputEvent(handler: InputBoardValueHandler): void
    triggerInputEvent(): void

    get(): BoardValue
    set(value: BoardValue): void
    clear(): void
}
export interface InputBoardValueHandler {
    (): void
}
