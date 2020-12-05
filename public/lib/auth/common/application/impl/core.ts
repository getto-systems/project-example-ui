import { SecureScriptPathInfra } from "../infra"

import { SecureScriptPath } from "../action"

import { markScriptPath } from "../data"

export const secureScriptPath = (infra: SecureScriptPathInfra): SecureScriptPath => (collector) => () => {
    const {
        host: { secureServerHost },
    } = infra

    const pagePathname = collector.getPagePathname()

    // アクセス中の html と同じパスで secure host に js がホストされている
    return markScriptPath(
        `//${secureServerHost}${pagePathname.replace(/\.html$/, "")}.js`
    )
}
