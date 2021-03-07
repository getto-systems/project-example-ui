import { delayedChecker } from "../../../z_vendor/getto-application/infra/timer/helper"

import { CheckDeployExistsRemote, FindInfra } from "../infra"

import { FindLocationDetectMethod, FindLocationKeys, FindPod } from "../action"

import { CheckRemoteError, Version } from "../data"
import { passThroughRemoteValue } from "../../../z_vendor/getto-application/infra/remote/helper"
import { appTargetLocationConverter, versionConverter } from "../convert"
import { versionToString } from "../helper"

interface Detecter {
    (keys: FindLocationKeys): FindLocationDetectMethod
}
export const detectAppTarget: Detecter = (keys) => (currentURL) =>
    appTargetLocationConverter(currentURL, keys.version)

export const find = (infra: FindInfra): FindPod => (detecter) => async (post) => {
    const { version, config } = infra
    const check = infra.check(passThroughRemoteValue)

    const target = detecter()
    const currentVersion = versionConverter(version)

    if (!currentVersion.valid) {
        post({ type: "succeed-to-find", upToDate: true, version, target })
        return
    }

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const next = await delayedChecker(findNext(check, currentVersion.value), config.delay, () =>
        post({ type: "delayed-to-find" }),
    )
    if (!next.success) {
        post({ type: "failed-to-find", err: { type: "failed-to-check", err: next.err } })
        return
    }

    if (!next.found) {
        post({ type: "succeed-to-find", upToDate: true, version, target })
    } else {
        post({
            type: "succeed-to-find",
            upToDate: false,
            version: versionToString(next.version),
            target,
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
    return {
        ...version,
        major: version.major,
        minor: version.minor + 1,
        patch: 0,
        suffix: "",
    }
}
function nextPatchVersion(version: Version): Version {
    return {
        ...version,
        major: version.major,
        minor: version.minor,
        patch: version.patch + 1,
        suffix: "",
    }
}

function checkURL(version: Version): string {
    return `/${versionToString(version)}/index.html`
}
