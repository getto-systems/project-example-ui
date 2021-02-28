import { Repository } from "../../z_vendor/getto-application/infra/repository/infra"

export type AuthzRepository = Repository<AuthzRepositoryResponse>
export type AuthzRepositoryResponse = Readonly<{
    nonce: string
    roles: string[]
}>
