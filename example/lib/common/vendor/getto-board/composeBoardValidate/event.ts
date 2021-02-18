import { BoardValidateState } from "./data";

export type ComposeBoardValidateEvent = Readonly<{
    type: "succeed-to-compose"
    state: BoardValidateState
}>
