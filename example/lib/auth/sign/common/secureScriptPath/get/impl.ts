import { pathnameLocationConverter, secureScriptPathConverter } from "./converter"

import { GetSecureScriptPathLocationMethod, GetSecureScriptPathPod } from "./method"

import { GetSecureScriptPathInfra } from "./infra"

export const detectPathname: GetSecureScriptPathLocationMethod = (currentURL: URL) =>
    pathnameLocationConverter(currentURL)

interface GetSecureScriptPath {
    (infra: GetSecureScriptPathInfra): GetSecureScriptPathPod
}
export const getSecureScriptPath: GetSecureScriptPath = (infra) => (detecter) => () => {
    const { config } = infra

    const pathname = detecter()
    if (!pathname.valid) {
        return { valid: false }
    }

    return secureScriptPathConverter(config.secureServerURL, pathname.value)
}
