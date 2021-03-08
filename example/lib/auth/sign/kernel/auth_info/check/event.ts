import { RepositoryError } from "../../../../../z_vendor/getto-application/infra/repository/data"
import { AuthInfo, RenewAuthInfoError } from "../kernel/data"

export type CheckAuthInfoEvent = Readonly<{ type: "try-to-instant-load" }> | RenewAuthInfoEvent

export type RenewAuthInfoEvent =
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RenewAuthInfoError }>
    | Readonly<{ type: "repository-error"; err: RepositoryError }>
    | Readonly<{ type: "succeed-to-renew"; auth: AuthInfo }>
