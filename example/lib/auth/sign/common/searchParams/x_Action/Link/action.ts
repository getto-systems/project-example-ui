import { ResetSessionID } from "../../../../password/reset/kernel/data"

export type AuthSignLinkResource = Readonly<{
    href: {
        password_authenticate(): string
        password_reset(): string
        password_reset_checkStatus(sessionID: ResetSessionID): string
    }
}>
