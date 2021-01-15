import { h, VNode } from "preact"
import { useEffect, useErrorBoundary } from "preact/hooks"

import { useTerminate } from "../../common/hooks"

import { ApplicationError } from "../../common/System/ApplicationError"
import { CurrentVersion } from "./CurrentVersion"

import { NotFoundEntryPoint } from "../../../example/NotFound/NotFound/view"

type Props = Readonly<{
    notFound: NotFoundEntryPoint
}>
export function NotFound({ notFound: { resource, terminate } }: Props): VNode {
    const [err] = useErrorBoundary((err) => {
        // TODO ここでエラーをどこかに投げたい。apiCredential が有効なはずなので、api にエラーを投げられるはず
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    useTerminate(terminate)

    useEffect(() => {
        document.title = `Not Found | ${document.title}`
    }, [])

    return h(CurrentVersion, resource)
}
