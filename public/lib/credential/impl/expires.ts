import { AuthExpires } from "../infra"

import { unpackAuthAt } from "../../credential/adapter"

import { AuthAt } from "../../credential/data"

export function initAuthExpires(): AuthExpires {
    return new Expires()
}

class Expires implements AuthExpires {
    hasExceeded(lastAuthAt: AuthAt, expire: ExpireTime): boolean {
        return new Date().getTime() > unpackAuthAt(lastAuthAt).getTime() + expire.expire_millisecond
    }
}

type ExpireTime = Readonly<{ expire_millisecond: number }>
