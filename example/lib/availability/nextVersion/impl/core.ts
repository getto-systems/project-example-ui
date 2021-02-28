import { delayedChecker } from "../../../z_vendor/getto-application/infra/timer/helper"

import { CheckDeployExistsRemote, FindInfra } from "../infra"

import { FindPod } from "../action"

import { CheckRemoteError, markVersion, Version, versionToString } from "../data"

export const find = (infra: FindInfra): FindPod => (locationInfo) => async (post) => {
    const { check, config } = infra

    const current = locationInfo.getAppTarget()

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const next = await delayedChecker(findNext(check, current.version), config.delay, () =>
        post({ type: "delayed-to-find" }),
    )
    if (!next.success) {
        post({ type: "failed-to-find", err: { type: "failed-to-check", err: next.err } })
        return
    }

    if (!next.found) {
        post({ type: "succeed-to-find", upToDate: true, target: current })
    } else {
        post({
            type: "succeed-to-find",
            upToDate: false,
            target: { ...current, version: next.version },
        })
    }
}

type FindNextResult =
    | Readonly<{ success: true; found: true; version: Version }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: false; err: CheckRemoteError }>

async function findNext(check: CheckDeployExistsRemote, current: Version): Promise<FindNextResult> {
    let result = await checkNext(current)

    while (result.success && result.found) {
        const next = await checkNext(result.version)
        if (!next.success || !next.found) {
            break
        }
        result = next
    }

    return result

    async function checkNext(current: Version): Promise<FindNextResult> {
        // 自動で major バージョンアップをするとまずいので minor バージョンのチェックから行う
        const response = await checkVersion(nextMinorVersion(current))
        if (!response.success) {
            return response
        }
        if (response.found) {
            return response
        }
        // minor バージョンが見つからなかったら patch バージョンのチェックを行う
        return await checkVersion(nextPatchVersion(current))
    }
    async function checkVersion(version: Version): Promise<FindNextResult> {
        const response = await check(checkURL(version))
        if (!response.success) {
            return response
        }
        if (!response.value.found) {
            return { success: true, found: false }
        }
        return { success: true, found: true, version }
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

function checkURL(version: Version): string {
    return `/${versionToString(version)}/index.html`
}
