import { AuthExpires } from "../infra"

import { unpackAuthAt } from "../../credential/adapter"

import { AuthAt } from "../../credential/data"

export function initAuthExpires(): AuthExpires {
    return new Expires()
}

class Expires implements AuthExpires {
    hasExceeded(lastAuthAt: Found<AuthAt>, expire: ExpireTime): boolean {
        if (!lastAuthAt.found) {
            return true
        }
        return new Date().getTime() > (unpackAuthAt(lastAuthAt.content).getTime() + expire.expire_milli_second)
    }
}

type ExpireTime = Readonly<{ expire_milli_second: number }>

type Found<T> =
    Readonly<{ found: false }> |
    Readonly<{ found: true, content: T }>
