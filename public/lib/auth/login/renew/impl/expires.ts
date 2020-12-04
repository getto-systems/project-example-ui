import { AuthExpires } from "../infra"

import { LoginAt } from "../../../common/credential/data"

export function initAuthExpires(): AuthExpires {
    return new Expires()
}

class Expires implements AuthExpires {
    hasExceeded(lastLoginAt: LoginAt, expire: ExpireTime): boolean {
        return new Date().getTime() > lastLoginAt.getTime() + expire.expire_millisecond
    }
}

type ExpireTime = Readonly<{ expire_millisecond: number }>
