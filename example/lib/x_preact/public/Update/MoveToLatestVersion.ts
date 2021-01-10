import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"

import { useTerminate } from "../../common/hooks"

import { ApplicationError } from "../../common/System/ApplicationError"

import { MoveToNextVersionEntryPoint } from "../../../update/Update/MoveToNextVersion/view"
import { NextVersion } from "./NextVersion"

type Props = Readonly<{
    moveToNextVersion: MoveToNextVersionEntryPoint
}>
export function MoveToLatestVersion({ moveToNextVersion: { resource, terminate } }: Props): VNode {
    const [err] = useErrorBoundary((err) => {
        // ここでエラーをどこかに投げたい、けど認証前なのでこれでお茶を濁す
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    useTerminate(terminate)

    return h(NextVersion, resource)
}
