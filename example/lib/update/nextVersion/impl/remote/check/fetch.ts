import { CheckClient, CheckResponse } from "../../../infra"

import { Version, versionToString } from "../../../data"

export function initFetchCheckClient(): CheckClient {
    return new Client()
}

class Client implements CheckClient {
    async check(version: Version): Promise<CheckResponse> {
        try {
            const response = await fetch(checkURL(version), { method: "HEAD" })
            if (!response.ok) {
                if (response.status >= 500) {
                    return { success: false, err: { type: "server-error" } }
                }
                return { success: true, found: false }
            }
            return { success: true, found: true, version }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
}

function checkURL(version: Version): string {
    return `/${versionToString(version)}/index.html`
}
