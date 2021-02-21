import { BoardValue } from "../../../../../z_getto/board/kernel/data"

export type TogglePasswordDisplayBoardEvent =
    | Readonly<{ visible: false }>
    | Readonly<{ visible: true; password: BoardValue }>
