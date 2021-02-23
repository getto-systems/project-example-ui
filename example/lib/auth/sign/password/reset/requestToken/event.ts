import { AuthSignHref } from "../../../common/searchParams/data"
import { RequestTokenError } from "./data"

export type RequestTokenEvent =
    | Readonly<{ type: "try-to-request-token" }>
    | Readonly<{ type: "delayed-to-request-token" }>
    | Readonly<{ type: "failed-to-request-token"; err: RequestTokenError }>
    | Readonly<{ type: "succeed-to-request-token"; href: AuthSignHref }>
