export async function moveToNextVersion(currentVersion: string): Promise<void> {
    const path = parsePathname(currentVersion, location.pathname)
    if (!path.isApplication) {
        // アプリケーションのパスでない場合は何もしない
        return
    }

    const nextVersion = await find(currentVersion)
    if (!nextVersion.found) {
        // 次のパージョンが見つからない場合は何もしない
        return
    }

    // ロケーション情報を引き継いで遷移
    location.href = `/${nextVersion.version}/${path.pathname}${location.search}${location.hash}`
}

type NextVersion = Readonly<{ found: false }> | Readonly<{ found: true; version: string }>

type AppPathname =
    | Readonly<{ isApplication: false }>
    | Readonly<{ isApplication: true; pathname: string }>

function parsePathname(current: string, pathname: string): AppPathname {
    const regexp = new RegExp(`^/${current}/`)
    if (!pathname.match(regexp)) {
        return { isApplication: false }
    }

    return {
        isApplication: true,
        pathname: pathname.replace(regexp, ""),
    }
}

type ParsedVersion = Readonly<{ valid: false }> | Readonly<{ valid: true; version: Version }>

type Version = Readonly<{ major: number; minor: number; patch: number }>

type Deploy = Readonly<{ found: false }> | Readonly<{ found: true; version: Version }>

async function find(current: string): Promise<NextVersion> {
    const result = parse(current)
    if (!result.valid) {
        return { found: false }
    }

    let deploy = await findNextDeploy(result.version)
    if (!deploy.found) {
        return { found: false }
    }

    while (deploy.found) {
        const nextDeploy: Deploy = await findNextDeploy(deploy.version)
        if (!nextDeploy.found) {
            break
        }

        deploy = nextDeploy
    }

    return { found: true, version: versionString(deploy.version) }
}

function parse(version: string): ParsedVersion {
    const splits = version.split(".")
    if (splits.length !== 3) {
        return { valid: false }
    }

    return {
        valid: true,
        version: {
            major: parseInt(splits[0]),
            minor: parseInt(splits[1]),
            patch: parseInt(splits[2]),
        },
    }
}

async function findNextDeploy(version: Version): Promise<Deploy> {
    const nextMinor = nextMinorVersion(version)
    if (await deployed(nextMinor)) {
        return { found: true, version: nextMinor }
    }

    const nextPatch = nextPatchVersion(version)
    if (await deployed(nextPatch)) {
        return { found: true, version: nextPatch }
    }

    return { found: false }
}

async function deployed(version: Version): Promise<boolean> {
    const response = await fetch(`/${versionString(version)}/index.html`, {
        method: "HEAD",
    })

    if (response.ok) {
        return true
    }

    return false
}

function nextMinorVersion(version: Version): Version {
    return {
        major: version.major,
        minor: version.minor + 1,
        patch: 0,
    }
}
function nextPatchVersion(version: Version): Version {
    return {
        major: version.major,
        minor: version.minor,
        patch: version.patch + 1,
    }
}

function versionString(v: Version): string {
    return `${v.major}.${v.minor}.${v.patch}`
}
