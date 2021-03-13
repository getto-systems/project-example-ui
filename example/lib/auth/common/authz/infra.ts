import { RepositoryPod } from "../../../z_vendor/getto-application/infra/repository/infra"
import { Authz } from "./data"

export type AuthzRepositoryPod = RepositoryPod<Authz, AuthzRepositoryValue>
export type AuthzRepositoryValue = Readonly<{
    nonce: string
    roles: string[]
}>
export type AuthzRemoteValue = Readonly<{
    nonce: string
    roles: string[]
}>
