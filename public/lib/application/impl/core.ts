import { Infra } from "../infra"

import { packScriptPath, unpackPagePathname } from "../adapter"

import { SecureScriptPathAction } from "../action"

const secureScriptPath = ({ host: { secureServerHost } }: Infra): SecureScriptPathAction => (
    pagePathname
) => {
    // secure host にアクセス中の html と同じパスで js がホストされている
    return packScriptPath(
        `//${secureServerHost}${unpackPagePathname(pagePathname).replace(/\.html$/, "")}.js`
    )
}

export function initSecureScriptPathAction(infra: Infra): SecureScriptPathAction {
    return secureScriptPath(infra)
}
