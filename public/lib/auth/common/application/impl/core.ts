import { SecureScriptPathInfra } from "../infra"

import { SecureScriptPathPod } from "../action"

import { markScriptPath } from "../data"

export const secureScriptPath = (infra: SecureScriptPathInfra): SecureScriptPathPod => (collector) => () => {
    const {
        config: { secureServerHost },
    } = infra

    const pagePathname = collector.getPagePathname()

    // アクセス中の html と同じパスで secure host に js がホストされている
    return markScriptPath(
        `//${secureServerHost}${pagePathname.replace(/\.html$/, "")}.js`
    )
}
