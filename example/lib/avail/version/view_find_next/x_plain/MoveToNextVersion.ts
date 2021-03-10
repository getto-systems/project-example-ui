import { FindNextVersionEntryPoint } from "../entry_point"

import { FindNextVersionCoreState } from "../core/action"

import { applicationPath } from "../../find_next/impl/helper"

import { ConvertLocationResult } from "../../../../z_vendor/getto-application/location/data"
import { ApplicationTargetPath } from "../../find_next/data"

export function MoveToNextVersion(entryPoint: FindNextVersionEntryPoint): void {
    // /${version}/index.html とかで実行する
    const { findNext } = entryPoint.resource
    try {
        findNext.subscriber.subscribe(handleState)
        findNext.ignite()
    } catch (err) {
        handleError(err)
    }

    function handleState(state: FindNextVersionCoreState) {
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
