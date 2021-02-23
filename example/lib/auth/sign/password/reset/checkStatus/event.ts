import { CheckSendingStatusError, SendingStatus, SendTokenError } from "./data"

export type CheckSendingStatusEvent =
    | Readonly<{ type: "try-to-check-status" }>
    | Readonly<{ type: "retry-to-check-status"; status: SendingStatus }>
    | Readonly<{ type: "failed-to-check-status"; err: CheckSendingStatusError }>
    | Readonly<{ type: "failed-to-send-token"; err: SendTokenError }>
    | Readonly<{ type: "succeed-to-send-token" }>
