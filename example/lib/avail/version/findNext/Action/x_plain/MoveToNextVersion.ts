import { FindNextVersionEntryPoint } from "../entryPoint"

import { FindNextVersionCoreActionState } from "../Core/action"

import { applicationPath } from "../../impl/helper"

import { ConvertLocationResult } from "../../../../../z_vendor/getto-application/location/detecter"
import { ApplicationTargetPath } from "../../data"

export function MoveToNextVersion(entryPoint: FindNextVersionEntryPoint): void {
    // /${version}/index.html とかで実行する
    const { findNext } = entryPoint.resource
    try {
        findNext.subscriber.subscribe(handleState)
        findNext.ignite()
    } catch (err) {
        handleError(err)
    }

    function handleState(state: FindNextVersionCoreActionState) {
        switch (state.type) {
            case "initial-next-version":
            case "delayed-to-find":
                // work in progress...
                return

            case "succeed-to-find":
                redirect(state.upToDate, state.version, state.target)
                return

            case "failed-to-find":
                handleError(state.err)
                return

            default:
                assertNever(state)
        }
    }
    function redirect(
        upToDate: boolean,
        version: string,
        target: ConvertLocationResult<ApplicationTargetPath>,
    ) {
        // 今のバージョンが最新なら何もしない
        if (upToDate) {
            return
        }

        location.href = applicationPath(version, target)
        entryPoint.terminate()
    }

    function handleError(err: unknown) {
        // エラーはどうしようもないので console.log でお茶を濁す
        console.log(err)
        entryPoint.terminate()
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
