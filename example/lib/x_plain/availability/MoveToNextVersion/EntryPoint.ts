import { MoveToNextVersionEntryPoint } from "../../../availability/z_EntryPoint/MoveToNextVersion/entryPoint"
import { NextVersionComponentState } from "../../../availability/x_Resource/MoveToNextVersion/nextVersion/component"

import { AppTarget, appTargetToPath } from "../../../availability/nextVersion/data"

export function EntryPoint({ resource, terminate }: MoveToNextVersionEntryPoint): void {
    // /${version}/index.html とかで実行する
    const { nextVersion } = resource
    try {
        const ignition = nextVersion.ignition()
        ignition.addStateHandler(handleState)
        ignition.ignite()
    } catch (err) {
        handleError(err)
    }

    function handleState(state: NextVersionComponentState) {
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
