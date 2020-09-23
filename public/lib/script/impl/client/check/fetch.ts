import { CheckClient, CheckResponse } from "../../../infra"

import { scriptPathToString } from "../../../adapter"

import { ScriptPath } from "../../../data"

export function initFetchCheckClient(): CheckClient {
    return new Client()
}

class Client implements CheckClient {
    checkStatus(scriptPath: ScriptPath): Promise<CheckResponse> {
        return new Promise((resolve) => {
            try {
                // TODO CloudFront のリソース読み込みができるか、本番環境で確認しないといけない
                const request = new XMLHttpRequest()
                request.addEventListener("load", (_e: Event) => {
                    resolve({ success: true })
                })
                request.addEventListener("error", (_e: Event) => {
                    resolve({ success: false, err: { type: "not-found" } })
                })
                request.withCredentials = true
                request.open("HEAD", scriptPathToString(scriptPath))
                request.send()
            } catch (err) {
                resolve({ success: false, err: { type: "infra-error", err } })
            }
        })
    }
}
