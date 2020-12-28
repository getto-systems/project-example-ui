import { CheckResponse, CheckClient, FindInfra } from "../infra"

import { FindPod } from "../action"

import { markVersion, Version } from "../data"

export const find = (infra: FindInfra): FindPod => (collector) => async (post) => {
    const { check, config, delayed } = infra

    const current = collector.getAppTarget()

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const next = await delayed(findNext(check, current.version), config.delay, () =>
        post({ type: "delayed-to-find" })
    )
    if (!next.success) {
        post({ type: "failed-to-find", err: { type: "failed-to-check", err: next.err } })
        return
    }

    if (!next.found) {
        post({ type: "succeed-to-find", upToDate: true, target: current })
    } else {
        post({ type: "succeed-to-find", upToDate: false, target: { ...current, version: next.version } })
    }
}

async function findNext(check: CheckClient, current: Version): Promise<CheckResponse> {
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
        const response = await check.check(nextMinorVersion(version))
        if (!response.success) {
            return response
        }
        if (!response.found) {
            // 見つからなかったら次の patch バージョンの情報を返す
            return await check.check(nextPatchVersion(version))
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
