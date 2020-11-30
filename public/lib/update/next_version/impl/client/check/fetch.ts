import { CheckClient, CheckResponse } from "../../../infra"

import { Version, versionToString } from "../../../data"

export function initCheckClient(): CheckClient {
    return new Client()
}

function checkURL(version: Version): string {
    return `/${versionToString(version)}/index.html`
}

class Client implements CheckClient {
    check(version: Version): Promise<CheckResponse> {
        return new Promise((resolve) => {
            try {
                const request = new XMLHttpRequest()

                request.addEventListener("load", () => {
                    if (request.status === 200) {
                        resolve({ success: true, found: true, version })
                    } else {
                        resolve({ success: true, found: false })
                    }
                })
                request.addEventListener("error", () => {
                    resolve({ success: false, err: { type: "server-error" } })
                })

                request.open("HEAD", checkURL(version))

                request.send()
            } catch (err) {
                resolve({ success: false, err: { type: "infra-error", err: `${err}` } })
            }
        })
    }
}
