import { RequestTokenEvent } from "./event"

import { BoardConvertResult } from "../../../../../z_getto/board/kernel/data"
import { RequestTokenFields } from "./data"

export interface RequestTokenMethod {
    (fields: BoardConvertResult<RequestTokenFields>, post: Post<RequestTokenEvent>): void
}

interface Post<T> {
    (state: T): void
}