import { Infra } from "../infra"

import { SecureScriptPath } from "../action"

import { markScriptPath } from "../data"

export const secureScriptPath = (infra: Infra): SecureScriptPath => (collector) => () => {
    const {
        host: { secureServerHost },
    } = infra

    const pagePathname = collector.getPagePathname()

    // secure host にアクセス中の html と同じパスで js がホストされている
    return markScriptPath(
        `//${secureServerHost}${pagePathname.replace(/\.html$/, "")}.js`
    )
}
