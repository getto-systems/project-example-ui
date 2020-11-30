import { newMoveToNextVersionAsSingle } from "../../update/Update/MoveToNextVersion/main"

import { appTargetToPath, FindError } from "../../update/next_version/data"

try {
    const moveToNextVersion = newMoveToNextVersionAsSingle()
    const nextVersion = moveToNextVersion().components.nextVersion

    nextVersion.onStateChange((state) => {
        switch (state.type) {
            case "initial-next-version":
                return

            case "succeed-to-find":
                location.href = appTargetToPath(state.target)
                return

            case "failed-to-find":
                failed(state.err)
                return

            default:
                assertNever(state)
        }
    })

    nextVersion.find()
} catch (err) {
    console.log(err)
}

function failed(err: FindError) {
    switch (err.type) {
        case "failed-to-check":
            console.log(err.err)
            return

        case "out-of-versioned":
        case "up-to-date":
            return

        default:
            assertNever(err)
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
