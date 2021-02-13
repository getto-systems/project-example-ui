import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"

import { useTermination } from "../../common/hooks"

import { ApplicationError } from "../../common/System/ApplicationError"

import { MoveToNextVersionEntryPoint } from "../../../availability/z_EntryPoint/MoveToNextVersion/entryPoint"
import { NextVersion } from "./NextVersion"

export function EntryPoint({ resource, terminate }: MoveToNextVersionEntryPoint): VNode {
    useTermination(terminate)

    const [err] = useErrorBoundary((err) => {
        // 認証前なのでエラーはどうしようもない
        console.log(err)
    })
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    return h(NextVersion, resource)
}
