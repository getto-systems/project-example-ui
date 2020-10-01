import { h, VNode } from "preact"
import { useState, useEffect, useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { ApplicationError } from "../application_error"

import { Dashboard } from "./dashboard"

import { HomeUsecase, initialHomeState } from "../../home/usecase"

type Props = Readonly<{
    usecase: HomeUsecase
}>

export function Main(props: Props): VNode {
    const [err, _resetError] = useErrorBoundary((err) => {
        // TODO ここでエラーをどこかに投げたい。apiCredential が有効なはずなので、api にエラーを投げられるはず
        // worker の catch でもエラー通知を入れたい
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    const [state, setState] = useState(initialHomeState)
    useEffect(() => {
        props.usecase.onStateChange(setState)

        const resource = props.usecase.init()
        resource.request({ type: "detect" })

        return resource.terminate
    }, [])

    switch (state.type) {
        case "initial":
            return EMPTY_CONTENT

        case "dashboard":
            return h(Dashboard, {
                example: {
                    component: props.usecase.component.example,
                    param: state.example,
                },
            })

        case "error":
            return h(ApplicationError, { err: state.err })
    }
}

const EMPTY_CONTENT = html``
