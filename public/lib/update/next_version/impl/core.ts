import { CheckResponse, CheckClient, FindInfra } from "../infra"

import { Find } from "../action"

import { markVersion, Version } from "../data"

export const find = (infra: FindInfra): Find => (collector) => async (post) => {
    const { client } = infra

    const current = collector.getAppTarget()
    if (!current.versioned) {
        post({ type: "failed-to-find", err: { type: "out-of-versioned" } })
        return
    }

    const next = await findNext(client, current.version)
    if (!next.success) {
        post({ type: "failed-to-find", err: { type: "failed-to-check", err: next.err } })
        return
    }
    if (!next.found) {
        post({ type: "failed-to-find", err: { type: "up-to-date" } })
        return
    }

    post({ type: "succeed-to-find", target: { ...current, version: next.version } })
}

async function findNext(client: CheckClient, current: Version): Promise<CheckResponse> {
    let result = await checkNext(current)

    while (result.success && result.found) {
        const next: CheckResponse = await checkNext(result.version)
        if (!next.success || !next.found) {
            break
        }
        result = next
    }

    return result

    async function checkNext(version: Version): Promise<CheckResponse> {
        // 自動で major バージョンアップをするとまずいので次の major バージョンの情報は返さない
        const response = await client.check(nextMinorVersion(version))
        if (!response.success) {
            return response
        }
        if (!response.found) {
            // 見つからなかったら次の patch バージョンの情報を返す
            return await client.check(nextPatchVersion(version))
        }
        return response
    }
}

function nextMinorVersion(version: Version): Version {
    if (!version.valid) {
        return version
    }
    return markVersion({
        valid: true,
        major: version.major,
        minor: version.minor + 1,
        patch: 0,
        suffix: "",
    })
}
function nextPatchVersion(version: Version): Version {
    if (!version.valid) {
        return version
    }
    return markVersion({
        valid: true,
        major: version.major,
        minor: version.minor,
        patch: version.patch + 1,
        suffix: "",
    })
}
