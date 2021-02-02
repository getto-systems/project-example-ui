import { MoveToNextVersionEntryPoint } from "../../../update/Update/MoveToNextVersion/entryPoint"
import { NextVersionState } from "../../../update/Update/nextVersion/component"

import { AppTarget, appTargetToPath } from "../../../update/nextVersion/data"

type Props = Readonly<{
    moveToNextVersion: MoveToNextVersionEntryPoint
}>
export function MoveToNextVersion({ moveToNextVersion: { resource, terminate } }: Props): void {
    // /${version}/index.html とかで実行する
    const { nextVersion } = resource
    try {
        nextVersion.addStateHandler(handleState)

        nextVersion.find()
    } catch (err) {
        handleError(err)
    }

    function handleState(state: NextVersionState) {
        switch (state.type) {
            case "initial-next-version":
            case "delayed-to-find":
                // work in progress...
                return

            case "succeed-to-find":
                redirectToAppTarget(state.upToDate, state.target)
                return

            case "failed-to-find":
                handleError(state.err)
                return

            default:
                assertNever(state)
        }
    }
    function redirectToAppTarget(upToDate: boolean, target: AppTarget) {
        // 今のバージョンが最新なら何もしない
        if (upToDate) {
            return
        }

        location.href = appTargetToPath(target)
        terminate()
    }

    function handleError(err: unknown) {
        // エラーはどうしようもないので console.log でお茶を濁す
        console.log(err)
        terminate()
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
