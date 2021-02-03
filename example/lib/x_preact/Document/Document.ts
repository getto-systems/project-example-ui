import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"

import { useTerminate } from "../common/hooks"

import { ApplicationError } from "../common/System/ApplicationError"
import { DocumentMenu } from "../Outline/Menu/DocumentMenu"
import { Content } from "./Content"

import { DocumentEntryPoint } from "../../document/Document/Document/entryPoint"
import { appLayout } from "../../z_vendor/getto-css/preact/layout/app"

type Props = {
    document: DocumentEntryPoint
}
export function Document({ document: { resource, terminate } }: Props): VNode {
    const [err] = useErrorBoundary((err) => {
        // TODO ここでエラーをどこかに投げたい。apiCredential が有効なはずなので、api にエラーを投げられるはず
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    useTerminate(terminate)

    return appLayout({
        main: h(Content, resource),
        menu: DocumentMenu(resource),
    })
}
