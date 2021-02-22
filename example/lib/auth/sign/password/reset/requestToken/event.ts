import { AuthSignHref } from "../../../common/searchParams/data"
import { RequestPasswordResetTokenError } from "./data"

export type RequestPasswordResetTokenEvent =
    | Readonly<{ type: "try-to-request-token" }>
    | Readonly<{ type: "delayed-to-request-token" }>
    | Readonly<{ type: "failed-to-request-token"; err: RequestPasswordResetTokenError }>
    | Readonly<{ type: "succeed-to-request-token"; href: AuthSignHref }>
