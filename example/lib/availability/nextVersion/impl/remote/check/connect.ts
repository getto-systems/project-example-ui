import { CheckRemoteAccess, CheckResponse } from "../../../infra"

import { CheckRemoteError, Version, versionToString } from "../../../data"
import { RawRemote, RemoteError } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { initConnectRemoteAccess } from "../../../../../z_vendor/getto-application/infra/remote/connect"

type CheckRawRemoteAccess = RawRemote<string, boolean>

export function initCheckConnectRemoteAccess(access: CheckRawRemoteAccess): CheckRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (version: Version): string => checkURL(version),
        value: (response: boolean, version: Version): CheckResponse => {
            if (!response) {
                return { found: false }
            }
            return { found: true, version }
        },
        error: (err: RemoteError): CheckRemoteError => {
            switch (err.type) {
                case "server-error":
                    return { type: err.type }

                default:
                    return { type: "infra-error", err: err.err }
            }
        },
        unknown: (err: unknown): CheckRemoteError => ({ type: "infra-error", err: `${err}` }),
    })
}

function checkURL(version: Version): string {
    return `/${versionToString(version)}/index.html`
}
