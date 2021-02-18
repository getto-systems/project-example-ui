import { BoardValue } from "../kernel/data"

export type InputBoardEvent = Readonly<{ type: "succeed-to-input"; value: BoardValue }>
