import { Infra } from "../infra"

import { packScriptPath, unpackPagePathname } from "../adapter"

import { SecureScriptPath } from "../action"

export const secureScriptPath = (infra: Infra): SecureScriptPath => (collector) => () => {
    const {
        host: { secureServerHost },
    } = infra

    const pagePathname = collector.getPagePathname()

    // secure host にアクセス中の html と同じパスで js がホストされている
    return packScriptPath(
        `//${secureServerHost}${unpackPagePathname(pagePathname).replace(/\.html$/, "")}.js`
    )
}
