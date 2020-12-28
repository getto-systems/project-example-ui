import { newMoveToNextVersionAsSingle } from "../../../../update/Update/MoveToNextVersion/main/single"

import { appTargetToPath } from "../../../../update/nextVersion/data"

try {
    // /${version}/index.html とかで呼び出される
    // 最新バージョンなら何もしない
    const nextVersion = newMoveToNextVersionAsSingle().resource.nextVersion

    nextVersion.onStateChange((state) => {
        switch (state.type) {
            case "initial-next-version":
            case "delayed-to-find":
                return

            case "succeed-to-find":
                if (!state.upToDate) {
                    location.href = appTargetToPath(state.target)
                }
                return

            case "failed-to-find":
                console.log(state.err.err)
                return

            default:
                assertNever(state)
        }
    })

    nextVersion.find()
} catch (err) {
    console.log(err)
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
