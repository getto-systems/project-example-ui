import { ResetSessionID } from "../../../password/reset/kernel/data"
import { SignHref } from "../data"

export type SignLinkResource = Readonly<{
    href: {
        static_privacy_policy(): SignHref

        password_authenticate(): SignHref
        password_reset_requestToken(): SignHref
        password_reset_checkStatus(sessionID: ResetSessionID): SignHref
    }
}>
