import { ResetSessionID } from "../../../password/reset/kernel/data"

export type SignSearchResource = Readonly<{
    href: {
        password_authenticate(): string
        password_reset_requestToken(): string
        password_reset_checkStatus(sessionID: ResetSessionID): string
    }
}>
